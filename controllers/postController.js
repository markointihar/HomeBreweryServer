// controllers/postController.js

const db = require('../config/db');

exports.createPost = (req, res) => {
    const { title, content,user_id } = req.body;
    const sql = 'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)';

    db.query(sql, [title, content, user_id], (err, result) => {
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
    const sql = `
    SELECT posts.*, users.name 
    FROM posts 
    INNER JOIN users ON posts.user_id = users.id 
    WHERE posts.id = ?
  `;
  
    

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

// controllers/postController.js

exports.getPostComments = (req, res) => {
    const postId = req.params.postId;
    const sql = `
        SELECT comments.*, users.name, users.profile_picture
        FROM comments
        INNER JOIN users ON comments.user_id = users.id
        WHERE comments.postId = ?
    `;

    db.query(sql, [postId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

// postController.js

exports.likePost = (req, res) => {
    const { postId } = req.params;
    const { user_id } = req.body; // Assuming user ID is sent in the request body

    const sql = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
    db.query(sql, [postId, user_id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Post liked successfully.');
    });
};

exports.unlikePost = (req, res) => {
    const { postId } = req.params;
    const { user_id } = req.body; // Assuming user ID is sent in the request body

    const sql = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
    db.query(sql, [postId, user_id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Post unliked successfully.');
    });
};


// controllers/postController.js

exports.searchPosts = (req, res) => {
    const { query } = req.query;
    const sql = 'SELECT * FROM posts WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC';

    db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};
