const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Authentication required. Please log in.' 
    });
  }
};

module.exports = { requireAuth };