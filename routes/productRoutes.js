const express = require('express');
const router = express.Router();
const logger = require('../middleware/logger');
const auth = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');

let products = [];

router.use(logger);


router.get('/', (req, res) => {
  let result = [...products];

  if (req.query.name) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(req.query.name.toLowerCase())
    );
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || result.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  res.json(result.slice(start, end));
});


router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  product
    ? res.json(product)
    : res.status(404).json({ message: 'Product not found' });
});


router.post('/', auth, validateProduct, (req, res) => {
  const newProduct = { id: `${Date.now()}`, ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});


router.put('/:id', auth, validateProduct, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});


router.delete('/:id', auth, (req, res) => {
  const initialLength = products.length;
  products = products.filter(p => p.id !== req.params.id);
  if (products.length < initialLength) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

module.exports = router;
