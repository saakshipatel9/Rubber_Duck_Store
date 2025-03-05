const express = require('express');
const db = require('./db');
const router = express.Router();

const calculateTotalCost = (color, size, quantity, price, destination_country, shipment_mode) => {
  
  let totalCost = quantity * price;
  let discountDetails = [];
  let packageType, protectionType;


  if (quantity > 100) {
    totalCost *= 0.8; 
    discountDetails.push("20% discount on order greater than 100 units");
  }

 
  if (size === 'XLarge' || size === 'Large') {
    packageType = 'Wood';
    protectionType = shipment_mode === 'Air' ? 'Polystyrene balls' : 'Polystyrene balls';
    totalCost *= 1.05;
  } 
  
  else if (size === 'Medium') {
    packageType = 'Cardboard';
    protectionType = shipment_mode === 'Air' ? 'Polystyrene balls' : 'Polystyrene balls';
    totalCost *= 0.99; 
  } 
  
  else {
    packageType = 'Plastic';
    protectionType = shipment_mode === 'Air' ? 'Bubble wrap bags' : 'Polystyrene balls';
    totalCost *= 1.10; 
  }


  if (shipment_mode === 'Sea') {
    totalCost += 400;
    protectionType = 'Moisture-absorbing beads and bubble wrap bags';
  } 
  
  else if (shipment_mode === 'Land') {
    totalCost += 10 * quantity; 
  } 
  
  else if (shipment_mode === 'Air') {
    totalCost += 30 * quantity;
    if (quantity > 1000) totalCost *= 0.85; 
  }


  switch (destination_country) {
    case 'USA':
      totalCost *= 1.18;
      discountDetails.push("USA: 18%");
      break;
    
      case 'Bolivia':
      totalCost *= 1.13;
      discountDetails.push("Bolivia: 13%");
      break;
    
      case 'India':
      totalCost *= 1.19;
      discountDetails.push("India: 19%");
      break;
    
      default:
      totalCost *= 1.15;
      discountDetails.push("Rest: 15%");
      break;
  }

  return { totalCost, packageType, protectionType, discountDetails };
};


router.post('/add', (req, res) => {
  const { color, size, quantity, price, destination_country, shipment_mode } = req.body;

  if (!color || !size || !quantity || !price || !destination_country || !shipment_mode) {
    return res.status(400);
  }

  const { totalCost, packageType, protectionType, discountDetails } = calculateTotalCost(color, size, quantity, price, destination_country, shipment_mode);

  const query = `INSERT INTO orderList (color, size, price, quantity, destination_country, shipment_mode, package_type, protection_type, total_cost, discount_details)
                 VALUES ('${color}', '${size}', ${price}, ${quantity}, '${destination_country}', '${shipment_mode}', '${packageType}', '${protectionType}', ${totalCost}, '${JSON.stringify(discountDetails)}')`;

  db.query(query, (e, result) => {
    if (e) {
      console.error(e);
      return res.status(500);
    }

    res.status(200).json({
      message: 'Order created',
      order: {
        id: result.insertId,
        color,
        size,
        price,
        quantity,
        destination_country,
        shipment_mode,
        package_type: packageType,
        protection_type: protectionType,
        total_cost: totalCost,
        discount_details: discountDetails
      }
    });
  });
});


router.get('/', (req, res) => {
  const query = 'SELECT * FROM orderList';

  db.query(query, (e, results) => {
    if (e) {
      console.error(e);
      return res.status(500);
    }

    res.status(200).json({ orders: results });
  });
});

module.exports = router;