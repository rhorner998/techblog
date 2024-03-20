const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const { ensureAuthenticated } = require('../middleware/authmiddleware');

// Logging middleware to check session info on each dashboard-related request
router.use((req, res, next) => {
  console.log(`Dashboard Route Request - Session ID: ${req.sessionID}`);
  console.log(`Dashboard Route Request - Session userId: ${req.session.userId}`);
  next();
});

router.get('/',async (req, res) => {
    console.log("AAAAAAAAAAAAAAAA",req.session)
    console.log('In Dashboardroutes.js for get: Session userId:', req.session.userId);
    try {
        const userPosts = await Post.findAll({
            where: { userId: req.session.userId }
        });

        // Log the count of user posts fetched from the database
        console.log(`Fetched ${userPosts.length} posts for user ID ${req.session.userId}`);

        res.render('dashboard', { posts: userPosts.map(post => post.get({ plain: true })),  loggedIn: req.session.loggedIn});
    } catch (error) {
        console.error('Error fetching posts for dashboard:', error);
        res.status(500).send('Server Error 1');
    }
});

// Route for displaying the form to edit a post
router.get('/posts/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const postId = req.params.id; // Capture the post ID from the URL
        console.log(`Attempting to edit post with ID ${postId} for user ID ${req.session.userId}`);

        const post = await Post.findByPk(postId);
        if (!post) {
            console.log(`Post not found with ID ${postId}`);
            return res.status(404).send('Post not found');
        }
        // Ensure the current user is the author of the post
        if (post.userId !== req.session.userId) {
            console.log(`Unauthorized attempt to edit post by user ID ${req.session.userId}`);
            return res.status(403).send('Unauthorized');
        }
        res.render('edit-post', { post: post.get({ plain: true }) }); // Pass the post data to the template
    } catch (error) {
        console.error('Error fetching post for editing:', error);
        res.status(500).send('Server Error 2');
    }
});

module.exports = router;
