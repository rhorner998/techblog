const router = require('express').Router();
const { ensureAuthenticated } = require('../middleware/authmiddleware');
const PostController = require('../controllers/postcontroller');
const { Post, Comment, User} = require('../models');

router.get('/new', ensureAuthenticated, (req, res) => {
    console.log('Accessing New Post Form');    
    res.render('new-post');
});

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    console.log('Accessing Edit Post Form');
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
        res.status(500).send('Server Error 5');
    }
});

router.post('/update/:id', ensureAuthenticated, async (req, res) => {
    // Your logic to handle the post update
    const postId = req.params.id;
    const { title, content } = req.body;
    
    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        // Ensure the current user is the author of the post
        if (post.userId !== req.session.userId) {
            return res.status(403).send('Unauthorized');
        }
        await post.update({ title, content });
        res.redirect('/dashboard'); // or wherever you wish to redirect after updating
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error 6');
    }
});



// Route to display a post and its comments
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [{
                model: Comment,
                include: [User] // Assuming each comment also references a User
            }, {
                model: User // The user who created the post
            }]
        });
        if (post) {
          // Convert the Sequelize model instance into a plain object
          const postData = post.get({ plain: true });

          // Log the post data structure to understand its layout
        //   console.log(JSON.stringify(postData, null, 2)); // Pretty print the object

            res.render('post-detail', { 
                post: post.get({ plain: true }),
                // Additional data for the view can be added here
            });
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error 7');
    }
});

// Route to handle comment submission
router.post('/:id/comments', ensureAuthenticated, async (req, res) => {
    const { commentContent } = req.body;
    try {
        await Comment.create({
            commentText: commentContent,
            postId: req.params.id,
            userId: req.session.userId // Ensure this is how you're storing the user's ID in the session
        });
        res.redirect(`/posts/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error 8');
    }
});

router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);
router.post('/', ensureAuthenticated, PostController.createPost);

router.delete('/:id', ensureAuthenticated, PostController.deletePost);

module.exports = router;