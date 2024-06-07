// routes/postRoute.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController')

router.post('/posts', postController.createPost);
router.get('/posts', postController.getPosts);
router.get('/posts/:postId', postController.getPostById);
router.post('/posts/:postId/upvote', postController.upvotePost); // New route for upvoting a post
router.post('/posts/:postId/downvote', postController.downvotePost); // New route for downvoting a post
router.get('/posts/:postId/comments', postController.getPostComments);
router.post('/posts/:postId/comments', commentController.addComment);


router.get('/search', postController.searchPosts);


router.post('/posts/:postId/like', postController.likePost);
router.post('/posts/:postId/unlike', postController.unlikePost);



module.exports = router;