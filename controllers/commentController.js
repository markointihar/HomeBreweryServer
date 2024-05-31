const db = require('../config/db');

exports.addComment = (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const sql = 'INSERT INTO comments (postId, content) VALUES (?, ?)';

    db.query(sql, [postId, content], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Comment added successfully.');
    });
};
