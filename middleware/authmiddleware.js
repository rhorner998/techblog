// authMiddleware.js

// Middleware to check if the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Middleware to redirect authenticated users to the dashboard
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    // Specify the routes that should not be redirected to the dashboard
    const allowedRoutes = ['/dashboard', '/logout']; // Add more routes if needed
    if (!allowedRoutes.includes(req.path)) {
      return res.redirect('/dashboard');
    }
  }
  next();
};

module.exports = { ensureAuthenticated, redirectIfAuthenticated };
