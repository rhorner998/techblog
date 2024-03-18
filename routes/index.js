const router = require('express').Router();
const postRoutes = require('./postroutes');
const commentRoutes = require('./commentroutes');
const userRoutes = require('./userroutes');
const dashboardRoutes = require('./dashboardroutes');
const { Post , User} = require('../models');
const UserController = require('../controllers/usercontroller');

// Mount other routers
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);

// Define a route for the root path to fetch and render all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: ['username']
            }]
        });

        // Convert each post model instance to a plain object
        const plainPosts = posts.map(post => post.get({ plain: true }));
        console.log(plainPosts); // Log the plain objects to confirm
        res.render('home', { posts: plainPosts });

    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server Error' }); // Make sure you have an error.handlebars view
    }
});

// catch-all 
router.use((req, res) => {
    console.log(`Wrong Route Accessed: ${req.path}`); // Log the wrong route accessed
    res.send("<h1>Wrong Route!</h1>")
});


module.exports = router;
