const router = require('express').Router();
const UserController = require('../controllers/usercontroller');

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  next();
};

const ensureAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// Adjust the path if your sign up form action is "/users/register"
router.post('/register', redirectIfAuthenticated, UserController.register);

router.post('/login', redirectIfAuthenticated, UserController.login);

router.post('/logout', ensureAuthenticated, UserController.logout);

router.get('/dashboard', ensureAuthenticated, UserController.dashboard);

// Add route for signup page
router.get('/signup', redirectIfAuthenticated, (req, res) => {
  // Make sure to point to the correct template and layout
  res.render('signup', { layout: 'main' });
});

router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('login', { layout: 'main' });
});

module.exports = router;
