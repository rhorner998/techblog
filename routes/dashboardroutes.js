const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const PostController = require('../controllers/postcontroller');
const { ensureAuthenticated } = require('../middleware/authmiddleware');


router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const userPosts = await Post.findAll({
            where: { userId: req.session.userId }
        });

        // If userPosts is an array and has elements, posts.length should be truthy
        res.render('dashboard', { posts: userPosts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// Route for displaying the form to edit a post
router.get('/posts/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const postId = req.params.id; // Capture the post ID from the URL
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        // Ensure the current user is the author of the post
        if (post.userId !== req.session.userId) {
            return res.status(403).send('Unauthorized');
        }
        res.render('edit-post', { post: post.get({ plain: true }) }); // Pass the post data to the template
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
