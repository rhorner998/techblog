const { Post, User } = require('../models');

const PostController = {
    // Get all posts
    async getAllPosts(req, res) {
        try {
            const posts = await Post.findAll({
                include: [{ model: User, attributes: ['username'] }]
            });
            // console.log("Retrieved all posts:", posts); // Log retrieved posts
            res.render('posts/all', { posts });
        } catch (error) {
            console.error('Error getting all posts:', error);
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
                console.log("Retrieved post by id:", post); // Log retrieved post
                res.render('posts/single', { post });
            } else {
                console.error("Post not found with id:", id);
                res.status(404).render('error', { message: "Post not found" });
            }
        } catch (error) {
            console.error('Error getting post by id:', error);
            res.status(500).render('error', { message: "Failed to get post", error: error.message });
        }
    },

    // Create a new post
    async createPost(req, res) {
        try {
            const { title, content } = req.body;
            const userId = req.session.userId;

            await Post.create({
                title,
                content,
                userId
            });
            console.log("New post created successfully."); // Log successful post creation
            res.redirect('/dashboard');
        } catch (error) {
            console.error('Error creating a new post:', error);
            res.status(500).render('new-post', { errorMessage: 'Error creating the post. Please try again.' });
        }
    },

    // Update a post
    async updatePost(req, res) {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            const updated = await Post.update({ title, content }, {
                where: { id, userId: req.session.userId }
            });

            if (updated[0] > 0) {
                console.log("Post updated successfully."); // Log successful post update
                res.redirect(`/posts/${id}`);
            } else {
                console.error("Post not found or no update needed with id:", id);
                res.status(404).render('error', { message: "Post not found or no update needed" });
            }
        } catch (error) {
            console.error('Error updating post:', error);
            res.status(500).render('error', { message: "Failed to update post", error: error.message });
        }
    },

    // Delete a post
    async deletePost(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Post.destroy({
                where: { id, userId: req.session.userId }
            });

            if (deleted) {
                console.log("Post deleted successfully."); // Log successful post deletion
                res.redirect('/dashboard');
            } else {
                console.error("Post not found with id:", id);
                res.status(404).render('error', { message: "Post not found" });
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            res.status(500).render('error', { message: "Failed to delete post", error: error.message });
        }
    },
    
   // Fetch and render the user's posts for the dashboard
    async getUserPosts(req, res) {
        try {
            const userPosts = await Post.findAll({
                where: { userId: req.session.userId }
            });
            //console.log("Retrieved user's posts:", userPosts); // Log retrieved user's posts
            res.render('dashboard', { posts: userPosts });
        } catch (error) {
            console.error('Error getting user posts:', error);
            res.status(500).render('error', { message: "Failed to load dashboard" });
        }
    }

};

module.exports = PostController;
