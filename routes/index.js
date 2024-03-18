const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');

const postRoutes = require('./postroutes');
const commentRoutes = require('./commentroutes');
const userRoutes = require('./userroutes');
const dashboardRoutes = require('./dashboardroutes');

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

// Catch-all route to handle undefined routes
router.use((req, res) => {
    console.log(`Wrong Route Accessed: ${req.path}`); // Log the wrong route accessed
    // Redirect to the home page if the route is not found
    res.redirect('/');
});

module.exports = router;
