// controllers/postController.js

const db = require('../config/db');

exports.createPost = (req, res) => {
    const { title, content } = req.body;
    const sql = 'INSERT INTO posts (title, content) VALUES (?, ?)';

    db.query(sql, [title, content], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Post created successfully.');
    });
};

exports.getPosts = (req, res) => {
    const sql = 'SELECT * FROM posts ORDER BY created_at DESC';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.upvotePost = (req, res) => {
    const { postId } = req.params;
    const sql = 'UPDATE posts SET upvotes = upvotes + 1 WHERE id = ?';

    db.query(sql, [postId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Post upvoted successfully.');
    });
};

exports.downvotePost = (req, res) => {
    const { postId } = req.params;
    const sql = 'UPDATE posts SET downvotes = downvotes + 1 WHERE id = ?';

    db.query(sql, [postId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Post downvoted successfully.');
    });

    
};

exports.getPostById = (req, res) => {
    const postId = req.params.postId;
    const sql = 'SELECT * FROM posts WHERE id = ?';

    db.query(sql, [postId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length === 0) {
            return res.status(404).send('Post not found');
        }
        res.json(result[0]);
    });

};

exports.getPostComments = (req, res) => {
    const postId = req.params.postId;
    const sql = 'SELECT * FROM comments WHERE postId = ?';

    db.query(sql, [postId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};
