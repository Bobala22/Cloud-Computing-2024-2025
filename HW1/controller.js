const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'social_network',
    password: 'postgres',
    port: 5432,
});

exports.login = function (req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { email, password } = JSON.parse(body);

            if (!password) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing password in request body' }));
                return;
            }

            const result = await pool.query('SELECT password FROM users WHERE email = $1', [email]);

            if (result.rows.length === 0) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid email or password' }));
                return;
            }

            const bcrypt = require('bcrypt');
            const match = await bcrypt.compare(password, result.rows[0].password);

            if (match) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ user: email }));
            } else {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Unauthorized' }));
            }
        }
        catch (err) {
            console.error('Error executing query', err.stack);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    });
};

/* ----------------- GET ----------------- */
exports.getUsers = async function (req, res) {
    try {
        const result = await pool.query('SELECT * FROM users');
        const users = result.rows;

        var response = {
            message: "Here is the list of all users: ",
            users: users
        };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
};

exports.getUserById = async function (req, res) {
    const userId = req.url.split('/')[2];

    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        if (user) {
            var response = {
                message: "User found",
                user: user
            };

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'User not found' }));
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
};

exports.getPostsByUserId = async function (req, res) {
    const userId = req.url.split('/')[2];
    console.log(userId);

    try {
        const result = await pool.query('SELECT * FROM posts WHERE user_id = $1', [userId]);
        const posts = result.rows;

        if (posts[0]) {
            var response = {
                message: "Here is the list of posts",
                posts: posts
            };

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'No posts found' }));
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
};

exports.getPostById = async function (req, res) {
    const postId = req.url.split('/')[4];
    const userId = req.url.split('/')[2];

    try {
        const result = await pool.query('SELECT * FROM posts WHERE user_id = $1 AND id = $2', [userId, postId]);
        const post = result.rows[0];

        if (post) {
            var response = {
                message: "Post found",
                post: post
            };

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Post not found' }));
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

exports.getCommsByPostId = async function (req, res) {
    const postId = req.url.split('/')[4];
    const userId = req.url.split('/')[2];

    try {
        const result = await pool.query('SELECT * FROM comments WHERE user_id = $1 AND post_id = $2', [userId, postId]);
        const comments = result.rows;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        if (comments.length == 0) {
            res.end(JSON.stringify({
                message: "No comments found",
                comments: []}));
        } else {
            var response = {
                message: "Here is the list of comments",
                comments: comments
            };
            res.end(JSON.stringify(response));
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

exports.getCommById = async function (req, res) {
    const commId = req.url.split('/')[6];
    const postId = req.url.split('/')[4];
    const userId = req.url.split('/')[2];

    try {
        const result = await pool.query('SELECT * FROM comments WHERE user_id = $1 AND post_id = $2 AND id = $3', [userId, postId, commId]);
        const comment = result.rows[0];

        if (comment) {
            var response = {
                message: "Comment found",
                comment: comment
            };

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Comment not found' }));
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

/* ----------------- POST ----------------- */
exports.createUser = async function (req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { name, email, password } = JSON.parse(body);
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        try {
            const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, passwordHash]);
            const user = result.rows[0];

            var response = {
                user: user
            };

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
        } catch (err) {
            console.error('Error executing query', err.stack);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    });
};

exports.createUserById = async function (req, res) {
    const userId = req.url.split('/')[2];

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'User not found' }));
        } else {
            res.statusCode = 409;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'User already exists' }));
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
};

exports.createPost = async function (req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { title, content, img_data } = JSON.parse(body);
        const userId = req.url.split('/')[2];

        try {
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
            const user = userResult.rows[0];

            if (!user) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'User not found' }));
                return;
            }

            const result = await pool.query(
                'INSERT INTO posts (user_id, title, content, b64_img) VALUES ($1, $2, $3, $4) RETURNING *',
                [userId, title, content, img_data]
            );
            const post = result.rows[0];

            const response = {
                message: "Post created",
                post: post
            };

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
        } catch (err) {
            console.error('Error executing query', err.stack);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    });
};

exports.createPostById = async function (req, res) {
    const postId = req.url.split('/')[4];
    const userId = req.url.split('/')[2];

    try {
        const postResult = await pool.query('SELECT * FROM posts WHERE user_id = $1 AND id = $2', [userId, postId]);
        const post = postResult.rows[0];

        if (!post) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Post not found' }));
        } else {
            res.statusCode = 409;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Post already exists' }));
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

exports.createComm = async function (req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        // Only extract content, no author
        const { content, author } = JSON.parse(body);
        const post_id = req.url.split('/')[4];
        const user_id = req.url.split('/')[2];

        try {
            // Check if post exists
            const userAndPostResult = await pool.query('SELECT * FROM posts WHERE user_id = $1 AND id = $2', [user_id, post_id]);
            const userAndPost = userAndPostResult.rows[0];

            if (!userAndPost) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Post not found' }));
                return;
            }

            // Insert comment without author field and RETURN the created row with its ID
            const result = await pool.query(
                'INSERT INTO comments (user_id, post_id, content, author) VALUES ($1, $2, $3, $4) RETURNING id, content, created_at, author', 
                [user_id, post_id, content ,author]
            );
            
            // Get the newly created comment
            const newComment = result.rows[0];

            // Return the comment directly (not wrapped in a response object)
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(newComment));
            
        } catch (err) {
            console.error('Error executing query', err.stack);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    });
};

exports.createCommById = async function (req, res) {
    const commId = req.url.split('/')[6];
    const postId = req.url.split('/')[4];
    const userId = req.url.split('/')[2];

    try {
        const commResult = await pool.query('SELECT * FROM comments WHERE user_id = $1 AND post_id = $2 AND id = $3', [userId, postId, commId]);
        const comment = commResult.rows[0];

        if (!comment) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Comment not found' }));
        } else {
            res.statusCode = 409;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Comment already exists' }));
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

/* ----------------- PUT ----------------- */
exports.updateUsers = async function (req, res) {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
};

exports.updateUser = async function (req, res) {
    const userId = req.url.split('/')[2];

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { name, email } = JSON.parse(body);

            try {
                if (!name && !email) {
                    res.statusCode = 204;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ "No changes": "No changes made" }));
                    return;
                } else if (!name && email) {
                    const result = await pool.query('UPDATE users SET email = $1 WHERE id = $2 RETURNING *', [email, userId]);
                    const user = result.rows[0];

                    var response = {
                        message: "User email updated",
                        user: user
                    };

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(response));
                } else if (name && !email) {
                    const result = await pool.query('UPDATE users SET name = $1 WHERE id = $2 RETURNING *', [name, userId]);
                    const user = result.rows[0];

                    var response = {
                        message: "User name updated",
                        user: user
                    };

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(response));
                } else {
                    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, userId]);
                    const user = result.rows[0];

                    var response = {
                        message: "User name and email updated",
                        user: user
                    };

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(response));
                }
            } catch (err) {
                console.error('Error executing query', err.stack);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
};

exports.updatePosts = async function (req, res) {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
}

exports.updatePost = async function (req, res) {
    const postId = req.url.split('/')[4];
    const userId = req.url.split('/')[2];

    try {
        const postResult = await pool.query('SELECT * FROM posts WHERE user_id = $1 AND id = $2', [userId, postId]);
        const post = postResult.rows[0];

        if (!post) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Post not found' }));
            return;
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { title, content } = JSON.parse(body);

            try {
                if (!title && !content) {
                    res.statusCode = 204;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ "No changes": "No changes made" }));
                    return;
                } else if (!title && content) {
                    const result = await pool.query('UPDATE posts SET content = $1 WHERE user_id = $2 AND id = $3 RETURNING *', [content, userId, postId]);
                    const post = result.rows[0];

                    var response = {
                        message: "Post content updated",
                        post: post
                    };

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(response));
                } else if (title && !content) {
                    const result = await pool.query('UPDATE posts SET title = $1 WHERE user_id = $2 AND id = $3 RETURNING *', [title, userId, postId]);
                    const post = result.rows[0];

                    var response = {
                        message: "Post title updated",
                        post: post
                    };

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(response));
                } else {
                    const result = await pool.query('UPDATE posts SET title = $1, content = $2 WHERE user_id = $3 AND id = $4 RETURNING *', [title, content, userId, postId]);
                    const post = result.rows[0];

                    var response = {
                        message: "Post title and content updated",
                        post: post
                    };

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(response));
                }
            } catch (err) {
                console.error('Error executing query', err.stack);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

exports.updateComms = async function (req, res) {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
}

exports.updateComm = async function (req, res) {
    const commId = req.url.split('/')[6];
    const postId = req.url.split('/')[4];
    const userId = req.url.split('/')[2];

    try {
        const commResult = await pool.query('SELECT * FROM comments WHERE user_id = $1 AND post_id = $2 AND id = $3', [userId, postId, commId]);
        const comment = commResult.rows[0];

        if (!comment) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Comment not found' }));
            return;
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { content } = JSON.parse(body);

            try {
                if (!content) {
                    res.statusCode = 204;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ "No changes": "No changes made" }));
                    return;
                } else {
                    const result = await pool.query('UPDATE comments SET content = $1 WHERE user_id = $2 AND post_id = $3 AND id = $4 RETURNING *', [content, userId, postId, commId]);
                    const comment = result.rows[0];

                    var response = {
                        message: "Comment updated",
                        comment: comment
                    };

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(response));
                }
            } catch (err) {
                console.error('Error executing query', err.stack);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

/* ----------------- DELETE ----------------- */
exports.deleteUsers = async function (req, res) {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
};

exports.deleteUser = async function (req, res) {
    const userId = req.url.split('/')[2];

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'User not found' }));
        } else {
            await pool.query(`
                DELETE FROM comments
                WHERE post_id IN (SELECT id FROM posts WHERE user_id = $1)
            `, [userId]);
            await pool.query('DELETE FROM posts WHERE user_id = $1', [userId]);
            await pool.query('DELETE FROM users WHERE id = $1', [userId]);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'User deleted' }));
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

exports.deletePosts = async function (req, res) {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
}

exports.deletePost = async function (req, res) {
    const postId = req.url.split('/')[4];
    const userId = req.url.split('/')[2];

    try {
        const postResult = await pool.query('SELECT * FROM posts WHERE user_id = $1 AND id = $2', [userId, postId]);
        const post = postResult.rows[0];

        if (!post) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Post not found' }));
        } else {
            await pool.query('DELETE FROM comments WHERE user_id = $1 AND post_id = $2', [userId, postId]);
            await pool.query('DELETE FROM posts WHERE user_id = $1 AND id = $2', [userId, postId]);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Post deleted' }));
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

exports.deleteComms = async function (req, res) {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
}

exports.deleteComm = async function (req, res) {
    const commId = req.url.split('/')[6];
    const postId = req.url.split('/')[4];
    const userId = req.url.split('/')[2];

    try {
        const commResult = await pool.query('SELECT * FROM comments WHERE user_id = $1 AND post_id = $2 AND id = $3', [userId, postId, commId]);
        const comment = commResult.rows[0];

        if (!comment) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Comment not found' }));
        } else {
            await pool.query('DELETE FROM comments WHERE user_id = $1 AND post_id = $2 AND id = $3', [userId, postId, commId]);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Comment deleted' }));
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}
