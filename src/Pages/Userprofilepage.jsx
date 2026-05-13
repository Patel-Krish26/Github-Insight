import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Componets/Navbar.jsx";
import { useUser } from "@clerk/clerk-react";

const Userprofilepage = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    const { userid } = useParams();
    const { user: clerkUser, isLoaded } = useUser();

    useEffect(() => {
        const loadBookmarks = () => {
            const savedBookmarks = JSON.parse(localStorage.getItem('githubBookmarks') || '[]');
            setBookmarks(savedBookmarks);
            setLoading(false);
        };

        loadBookmarks();
    }, []);

    const removeBookmark = (login) => {
        let savedBookmarks = JSON.parse(localStorage.getItem('githubBookmarks') || '[]');
        savedBookmarks = savedBookmarks.filter(b => b.login !== login);
        localStorage.setItem('githubBookmarks', JSON.stringify(savedBookmarks));
        setBookmarks(savedBookmarks);
    };

    if (loading || !isLoaded) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div style={{ textAlign: "center" }}>
                    <img src="https://github.githubassets.com/images/spinners/octocat-spinner-128.gif" alt="Loading..." />
                    <p>Github Insights</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <header className="bg-dark text-white py-5">
                <div className="container text-center">
                    <h1 className="display-5">My Profile</h1>
                    <p className="lead">
                        {clerkUser?.emailAddresses?.[0]?.emailAddress || clerkUser?.username || "Welcome back!"}
                    </p>
                </div>
            </header>

            <main className="py-5">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>My Bookmarks ({bookmarks.length})</h2>
                        {bookmarks.length > 0 && (
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                    if (confirm("Clear all bookmarks?")) {
                                        localStorage.removeItem('githubBookmarks');
                                        setBookmarks([]);
                                    }
                                }}
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {bookmarks.length > 0 ? (
                        <div className="row g-3">
                            {bookmarks.map((bookmark, index) => (
                                <div key={index} className="col-md-6 col-lg-4">
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body d-flex align-items-center">
                                            <img
                                                src={bookmark.avatar_url}
                                                alt={bookmark.login}
                                                className="rounded-circle me-3"
                                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                            />
                                            <div className="flex-grow-1">
                                                <h5 className="mb-1">{bookmark.login}</h5>
                                                <p className="text-muted small mb-2">{bookmark.name || ""}</p>
                                                <Link
                                                    to={`/userdetail/${userid || clerkUser?.id}/${bookmark.login}`}
                                                    className="btn btn-primary btn-sm me-2"
                                                >
                                                    View Profile
                                                </Link>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => removeBookmark(bookmark.login)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div className="mb-4">
                                <h3 className="text-muted">No bookmarks yet</h3>
                                <p>Go to any user profile and click "☆ Bookmark User" to save them here.</p>
                            </div>
                            <Link to="/HomePage" className="btn btn-primary btn-lg">
                                Start Exploring Users
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Userprofilepage;