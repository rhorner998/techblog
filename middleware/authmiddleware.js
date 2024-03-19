// authMiddleware.js

// Middleware to check if the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  console.log("ensureAuthenticated middleware triggered.");
  console.log("Request URL:", req.originalUrl);
  console.log("Session:", req.session);
  if (req.session.userId) {
      console.log("User is authenticated.");
      next();
  } else {
      console.log("User is not authenticated. Redirecting to /login.");
      res.redirect('/users/login');
  }
};

// Middleware to redirect authenticated users to the dashboard
const redirectIfAuthenticated = (req, res, next) => {
  console.log("redirectIfAuthenticated middleware triggered.");
  console.log("Request URL:", req.originalUrl);
  console.log("Session:", req.session);
  if (req.session.userId) {
      console.log("User is authenticated. Checking allowed routes.");
      // Specify the routes that should not be redirected to the dashboard
      const allowedRoutes = ['/dashboard', '/logout', '/login']; // Add more routes if needed
      if (!allowedRoutes.includes(req.path)) {
          console.log("Redirecting authenticated user to /dashboard.");
          return res.redirect('/dashboard');
      }
  }
  console.log("User is not authenticated or allowed to access the route.");
  next();
};

module.exports = { ensureAuthenticated, redirectIfAuthenticated };
