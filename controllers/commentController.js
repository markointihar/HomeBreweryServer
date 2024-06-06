const db = require('../config/db');

exports.addComment = (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const { user_id } = req.body;
    const sql = 'INSERT INTO comments (postId, content, user_id) VALUES (?, ?, ?)';

    db.query(sql, [postId, content, user_id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Comment added successfully.');
    });
};
