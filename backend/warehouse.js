const express = require('express');
const Duck = require('./duck');
const router = express.Router();

router.post('/add', (req, res) => {
    const { color, size, price, quantity } = req.body;
    
    Duck.create(color, size, price, quantity, (e, result) => {
      if (e) {
        return res.status(500);
      }

      res.status(200).json({ message: 'duckList changed' });
    });
  });

router.get('/', (req, res) => {
  
  Duck.getAll((e, results) => {
    if (e) {
      return res.status(500);
    }

    res.status(200).json(results);
  });
});

router.put('/update/:id', (req, res) => {
  
  const { color, size, price, quantity } = req.body;
  const { id } = req.params;
  
  Duck.update(id, color, size, price, quantity, (e, result) => {
    if (e) {
      return res.status(500);
    }

    res.status(200);
  });
});

router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    
    Duck.delete(id, (e, result) => {
      if (e) {
        return res.status(500);
      }

      res.status(200);
    });
  });

module.exports = router;
