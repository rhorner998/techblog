const { Comment, User } = require('../models');
const { ensureAuthenticated } = require('../middleware/authmiddleware');

const CommentController = {
  async postComment(req, res) {
    try {
      const { commentText, postId } = req.body;
      const userId = req.session.userId;
      const newComment = await Comment.create({
        commentText,
        postId,
        userId,
      });
      res.json(newComment);
    } catch (error) {
      res.status(500).json({ message: "Failed to post comment", error: error.message });
    }
  },

  async getCommentsByPost(req, res) {
    try {
      const { postId } = req.params;
      const comments = await Comment.findAll({
        where: { postId },
        include: [{ model: User, attributes: ['username'] }]
      });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get comments", error: error.message });
    }
  },

  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Comment.destroy({
        where: { id, userId: req.session.userId }
      });

      if (deleted) {
        res.json({ message: "Comment deleted successfully" });
      } else {
        res.status(404).json({ message: "Comment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete comment", error: error.message });
    }
  },

  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { commentText } = req.body;
      const updated = await Comment.update({ commentText }, {
        where: { id, userId: req.session.userId }
      });

      if (updated[0] > 0) {
        res.json({ message: "Comment updated successfully" });
      } else {
        res.status(404).json({ message: "Comment not found or no update needed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update comment", error: error.message });
    }
  }
};

module.exports = CommentController;
