const express = require('express');
const router = express.Router();

// Ensure this path is in QUOTES and points to your controller file
const nodeController = require('../controllers/nodeController'); 

// The functions (getAllNodes, etc.) must exist in your nodeController.js
router.get('/', nodeController.getAllNodes);
router.post('/', nodeController.createNode);
router.patch('/:id', nodeController.updateNode);

module.exports = router;