const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const warehouse = require('./warehouse');
const order = require('./store');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/ducks', warehouse);
app.use('/api/orders', order); 

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});