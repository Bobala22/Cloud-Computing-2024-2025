import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import '../styles/new-post.css';

function fileToGenerativePart(image, mimeType) {
    return {
        inlineData: {
            data: image,
            mimeType,
        },
    };
}

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [imageBase64, setImageBase64] = useState('');
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            navigate('/');
            return;
        }

        const userObj = JSON.parse(loggedInUser);
        setUser(userObj);
    }, [navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const fullResult = reader.result;
                setImagePreview(reader.result);
                const base64Data = fullResult.split(',')[1];
                setImageBase64(base64Data);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateAIContent = async () => {
        if (!imageBase64) {
            setError('Please upload an image first');
            return;
        }
        setIsGeneratingContent(true);
        try {
            const response = await fetch('http://localhost:5002/api/generate-caption', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageBase64
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to generate caption: ${response.statusText}`);
            }

            const data = await response.json();
            setContent(data.caption);
        } catch (error) {
            console.error('Error generating content:', error);
            setError('Failed to generate content');
        } finally {
            setIsGeneratingContent(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim() || !imageBase64) {
            setError('Title, content and imgage path are required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://127.0.0.1:3000/users/${user.id[0].id}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    img_data: imageBase64,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-post">
            <header className="create-post-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
                <h1>Create New Post</h1>
            </header>

            <div className="create-post-container">
                <form onSubmit={handleSubmit} className="post-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Add a title..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Caption</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write a caption..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Upload Image</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                                <button
                                    type="button"
                                    className="ai-generate-button"
                                    onClick={generateAIContent}
                                    disabled={isGeneratingContent}
                                >
                                    {isGeneratingContent ? 'Generating...' : '🤖 Generate AI Caption'}
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Post'}
                    </button>
                </form>
            </div>
        </div>
    );
}