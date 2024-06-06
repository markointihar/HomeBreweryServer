const db = require('../config/db');





exports.addComment = (req, res) => {
    const { postId } = req.params;
    const { content, user_id } = req.body; // Make sure to pass `user_id` from the front-end
    const sql = 'INSERT INTO comments (postId, content, user_id) VALUES (?, ?, ?)';

    db.query(sql, [postId, content, user_id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Comment added successfully.');
    });
};


// exports.likeComment = (req, res) => {
//     const { commentId } = req.params;
//     const sql = 'UPDATE comments SET likes = likes + 1 WHERE id = ?';

//     db.query(sql, [commentId], (err, result) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.status(200).send('Comment liked successfully.');
//     });
// };

// exports.getPostComments = (req, res) => {
//     const postId = req.params.postId;
//     const sql = `
//         SELECT comments.*, users.name, users.profile_picture
//         FROM comments
//         JOIN users ON comments.user_id = users.id
//         WHERE comments.postId = ?
//         ORDER BY comments.created_at ASC
//     `;

//     db.query(sql, [postId], (err, results) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.json(results);
//     });
// };