const express = require('express');
const Budget = require('../models/Budget');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const budgets = await Budget.findByUserId(req.session.userId);
    
    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching budget items',
      error: error.message
    });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { category, type, amount, description } = req.body;
    
    const budget = await Budget.create({
      userId: req.session.userId,
      category,
      type,
      amount,
      description
    });
    
    res.status(201).json({
      success: true,
      message: 'Budget item added successfully',
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding budget item',
      error: error.message
    });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUserId(req.params.id, req.session.userId);
    
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget item not found'
      });
    }
    
    await Budget.delete(req.params.id);
    
    res.json({
      success: true,
      message: 'Budget item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting budget item',
      error: error.message
    });
  }
});

router.get('/summary', requireAuth, async (req, res) => {
  try {
    const summary = await Budget.getSummary(req.session.userId);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching summary',
      error: error.message
    });
  }
});

module.exports = router;