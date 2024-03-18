const { Post, User } = require('../models');

const PostController = {
    // Get all posts
    async getAllPosts(req, res) {
        try {
            const posts = await Post.findAll({
                include: [{ model: User, attributes: ['username'] }]
            });
            // Render a view that lists all posts
            res.render('posts/all', { posts });
        } catch (error) {
            // Render an error view, or handle the error appropriately
            res.status(500).render('error', { message: "Failed to get posts", error: error.message });
        }
    },

    // Get a single post by id
    async getPostById(req, res) {
        try {
            const { id } = req.params;
            const post = await Post.findOne({
                where: { id },
                include: [{ model: User, attributes: ['username'] }]
            });

            if (post) {
                // Render a view that shows the post
                res.render('posts/single', { post });
            } else {
                res.status(404).render('error', { message: "Post not found" });
            }
        } catch (error) {
            res.status(500).render('error', { message: "Failed to get post", error: error.message });
        }
    },

    // Create a new post
    async createPost(req, res) {
        try {
            const { title, content } = req.body;
            const userId = req.session.userId; // Assuming you store the user's ID in the session upon login
            
            // Create a new post in the database
            await Post.create({
                title,
                content,
                userId // Associate the post with the currently logged-in user
            });
            
            // Redirect to the dashboard or another appropriate page after successful creation
            res.redirect('/dashboard');
        } catch (error) {
            console.error('Error creating a new post:', error);
            
            // If there's an error, you might render the form again with an error message
            // Or you could redirect to an error page or the form page with a flash message
            res.status(500).render('new-post', { errorMessage: 'Error creating the post. Please try again.' });
        }
    },

    // Update a post
    async updatePost(req, res) {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            const updated = await Post.update({ title, content }, {
                where: { id, userId: req.session.userId } // Only allow updates to the user's own posts
            });

            if (updated[0] > 0) {
                // Redirect to the updated post
                res.redirect(`/posts/${id}`);
            } else {
                res.status(404).render('error', { message: "Post not found or no update needed" });
            }
        } catch (error) {
            res.status(500).render('error', { message: "Failed to update post", error: error.message });
        }
    },

    // Delete a post
    async deletePost(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Post.destroy({
                where: { id, userId: req.session.userId } // Only allow deletion of the user's own posts
            });

            if (deleted) {
                // Redirect back to the dashboard
                res.redirect('/dashboard');
            } else {
                res.status(404).render('error', { message: "Post not found" });
            }
        } catch (error) {
            res.status(500).render('error', { message: "Failed to delete post", error: error.message });
        }
    },
    
   // Fetch and render the user's posts for the dashboard
    async getUserPosts(req, res) {
        try {
            const userPosts = await Post.findAll({
                where: { userId: req.session.userId }
            });
            res.render('dashboard', { posts: userPosts });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { message: "Failed to load dashboard" });
        }
    }

};

module.exports = PostController;
