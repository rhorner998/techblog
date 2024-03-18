// authMiddleware.js

// Middleware to check if the user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      next();
    } else {
      res.redirect('/login');
    }
  };
  
  // Middleware to prevent logged-in users from accessing certain routes
  const redirectIfAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      res.redirect('/dashboard');
    } else {
      next();
    }
  };
  
  module.exports = { ensureAuthenticated, redirectIfAuthenticated };
  