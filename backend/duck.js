const db = require('./db');

const Duck = {
  create: (color, size, price, quantity, callback) => {
    const checkQuery = `SELECT * FROM duckList WHERE color = ? AND size = ? AND price = ? AND deleted = false`;
    
    db.query(checkQuery, [color, size, price], (e, results) => {
      if (e) {
        return callback(e);
      }
      
      if (results.length > 0) {
        const updateQuantity = parseInt(results[0].quantity, 10) + parseInt(quantity, 10);
        const updateQuery = `UPDATE duckList SET quantity = ? WHERE id = ?`;
        db.query(updateQuery, [updateQuantity, results[0].id], callback);
      } 
      
      else {
        const insertQuery = `INSERT INTO duckList (color, size, price, quantity, deleted) VALUES (?, ?, ?, ?, ?)`;
        db.query(insertQuery, [color, size, price, quantity, false], callback);
      }
      
    });
  },
  
  getAll: (callback) => {
    const query = `SELECT * FROM duckList WHERE deleted = false`;
    db.query(query, callback);
  },
  
  update: (id, color, size, price, quantity, callback) => {
    const query = `UPDATE duckList SET price = ?, quantity = ? WHERE id = ?`;
    db.query(query, [price, quantity, id], callback);
  },
  
  delete: (id, callback) => {
    const query = `UPDATE duckList SET deleted = true WHERE id = ?`;
    db.query(query, [id], callback);
  },
};

module.exports = Duck;