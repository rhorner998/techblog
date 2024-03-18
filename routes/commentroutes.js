const router = require('express').Router();
const CommentsController = require('../controllers/commentcontroller');
const { ensureAuthenticated } = require('../middleware/authmiddleware');

router.post('/', ensureAuthenticated, CommentsController.postComment);
router.get('/post/:postId', CommentsController.getCommentsByPost);
router.delete('/:id', ensureAuthenticated, CommentsController.deleteComment);
router.put('/:id', ensureAuthenticated, CommentsController.updateComment);

module.exports = router;
