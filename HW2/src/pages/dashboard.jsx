import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComments, setNewComments] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            navigate('/');
            return;
        }
        const userObj = JSON.parse(loggedInUser);
        setUser(userObj);

        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:3000/users/${userObj.id[0].id}/posts`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();

                const postsWithComments = await Promise.all(
                    data.posts.map(async (post) => {
                        let imageUrl = post.b64_img
                            ? post.b64_img.startsWith('data:')
                                ? post.b64_img
                                : `data:image/jpeg;base64,${post.b64_img}`
                            : 'https://via.placeholder.com/600x400?text=No+Image';

                        const commentsRes = await fetch(`http://127.0.0.1:3000/users/${userObj.id[0].id}/posts/${post.id}/comments`);

                        const commentsResData = await commentsRes.json();
                        const commentsData = commentsResData.comments || [];
                        return {
                            id: post.id,
                            title: post.title,
                            caption: post.content,
                            imageUrl,
                            timestamp: new Date(post.created_at).toLocaleDateString(),
                            comments: commentsData,
                            likes: 0,
                        };
                    })
                );

                setPosts(postsWithComments);
            } catch (error) {
                console.error('Error details:', {
                    message: error.message,
                    type: error.name,
                    stack: error.stack
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
        window.scrollTo(0, 0);
    }, [navigate]);

    const handleCommentChange = (postId, value) => {
        setNewComments((prev) => ({ ...prev, [postId]: value }));
    };

    const handleAddComment = async (postId) => {
        const text = newComments[postId]?.trim();
        if (!text) return;

        try {
            const response = await fetch(`http://127.0.0.1:3000/users/${user?.id[0].id}/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: text,
                    author: user?.email || 'Anonymous'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create comment');
            }

            const newComment = await response.json();

            const commentWithAuthor = {
                id: newComment.id || Date.now(),
                content: newComment.content || text,
                author: newComment.author || user?.email 
            };

            console.log('Adding comment:', commentWithAuthor);

            setPosts((prevPosts) =>
                prevPosts.map((post) => {
                    if (post.id === postId) {
                        const updatedComments = [...post.comments, commentWithAuthor];
                        console.log('Updated comments for post', postId, updatedComments);
                        return {
                            ...post,
                            comments: updatedComments
                        };
                    }
                    return post;
                })
            );

            setNewComments((prev) => ({ ...prev, [postId]: '' }));
        } catch (error) {
            console.error('Add comment failed:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="logo">CLike</div>
                <div className="search-bar">
                    <input type="text" placeholder="Search" />
                </div>
                <nav className="nav-icons">
                    <button className="icon-button">🏠</button>
                    <button className="icon-button">✉️</button>
                    <button className="icon-button" onClick={() => navigate('/new-post')}>➕</button>
                    <button className="icon-button">🧭</button>
                    <button className="icon-button">❤️</button>
                    <button className="profile-pic">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} />
                        ) : (
                            <div className="default-avatar">{user?.name?.charAt(0)}</div>
                        )}
                    </button>
                </nav>
            </header>

            <div className="dashboard-content">
                <main className="main-feed">
                    {posts.map((post) => (
                        <div className="post" key={post.id}>
                            <div className="post-header">
                                <div className="post-user">
                                    <div className="post-user-avatar">
                                        {user?.profilePicture ? (
                                            <img src={user.profilePicture} alt={user.name} />
                                        ) : (
                                            <div className="default-avatar">{user?.name?.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="post-user-name">{user?.name}</div>
                                </div>
                                <button className="post-more">•••</button>
                            </div>
                            <div className="post-image">
                                <img src={post.imageUrl} alt={post.caption} />
                            </div>
                            <div className="post-actions">
                                <button className="post-action">❤️</button>
                                <button className="post-action">💬</button>
                                <button className="post-action">📤</button>
                                <button className="post-action save-button">🔖</button>
                            </div>
                            <div className="post-likes">{post.likes} likes</div>
                            <div className="post-caption">
                                <span className="post-user-name">{user?.name}</span> {post.caption}
                            </div>

                            <div className="post-comments">
                                {post.comments.map((c) => (
                                    <div className="comment" key={c.id}>
                                        <strong>{c.author}</strong> {c.content}
                                    </div>
                                ))}
                            </div>

                            <div className="post-time">{post.timestamp}</div>

                            {/* Add comment input */}
                            <div className="post-add-comment">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComments[post.id] || ''}
                                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                />
                                <button onClick={() => handleAddComment(post.id)}>Post</button>
                            </div>
                        </div>
                    ))}
                </main>

                <div className="sidebar">
                    <div className="user-profile">
                        <div className="user-avatar">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt={user.name} />
                            ) : (
                                <div className="default-avatar large">{user?.name?.charAt(0)}</div>
                            )}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{user?.name}</div>
                            <div className="user-email">{user?.email}</div>
                        </div>
                    </div>

                    <div className="stats">
                        <div className="stat">
                            <div className="stat-count">{posts.length}</div>
                            <div className="stat-label">posts</div>
                        </div>
                        <div className="stat">
                            <div className="stat-count">125</div>
                            <div className="stat-label">followers</div>
                        </div>
                        <div className="stat">
                            <div className="stat-count">150</div>
                            <div className="stat-label">following</div>
                        </div>
                    </div>

                    <button className="logout-button" onClick={handleLogout}>Log Out</button>
                </div>
            </div>
        </div>
    );
}