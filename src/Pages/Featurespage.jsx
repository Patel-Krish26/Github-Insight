import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Componets/Navbar.jsx";
import githubmark from "../assets/bookmark.webp";
import charts from "../assets/charts.jpg";
import explore from "../assets/explore.jpg";

const Featurespage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [bookmarks, setBookmarks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('githubBookmarks') || '[]');
        setBookmarks(saved);
    }, []);

    const handleQuickSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/HomePage?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate("/HomePage");
        }
    };

    const removeBookmark = (login) => {
        let saved = JSON.parse(localStorage.getItem('githubBookmarks') || '[]');
        saved = saved.filter(b => b.login !== login);
        localStorage.setItem('githubBookmarks', JSON.stringify(saved));
        setBookmarks(saved);
    };

    const goToUser = (login) => {
        navigate(`/userdetail/${login}`);
    };

    return (
        <>
            <Navbar />

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold mb-3">GitHub Insights Features</h1>
                    <p className="lead">Everything you need to explore GitHub smarter</p>
                </div>

                {/* Quick Search - Most Prominent */}
                <div className="row justify-content-center mb-5">
                    <div className="col-md-7">
                        <div className="input-group input-group-lg shadow">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search any GitHub username instantly..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
                            />
                            <button className="btn btn-primary px-5" onClick={handleQuickSearch}>
                                Go
                            </button>
                        </div>
                    </div>
                </div>

                {/* Live Stats */}
                <div className="row g-4 mb-5 text-center">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h2 className="text-primary">{bookmarks.length}</h2>
                                <p className="mb-0 fw-bold">Bookmarks Saved</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h2 className="text-success">Live</h2>
                                <p className="mb-0 fw-bold">GitHub API</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h2 className="text-info">Chart.js</h2>
                                <p className="mb-0 fw-bold">Visual Analytics</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Feature 1: Bookmarks */}
                    <div className="col-lg-4">
                        <div className="card h-100 shadow">
                            <img src={githubmark} className="card-img-top" style={{ height: "220px", objectFit: "cover" }} alt="Bookmarks" />
                            <div className="card-body">
                                <h4>Smart Bookmarks</h4>
                                <p>Save users locally and manage them here.</p>

                                {bookmarks.length > 0 && (
                                    <div className="mt-3">
                                        <h6>Your Bookmarks ({bookmarks.length})</h6>
                                        {bookmarks.slice(0, 4).map((b, i) => (
                                            <div key={i} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                                <div className="d-flex align-items-center">
                                                    <img src={b.avatar_url} alt="" className="rounded-circle me-2" style={{ width: "35px", height: "35px" }} />
                                                    <span>{b.login}</span>
                                                </div>
                                                <div>
                                                    <button className="btn btn-sm btn-primary me-1" onClick={() => goToUser(b.login)}>
                                                        View
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => removeBookmark(b.login)}>
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Visualizations */}
                    <div className="col-lg-4">
                        <div className="card h-100 shadow">
                            <img src={charts} className="card-img-top" style={{ height: "220px", objectFit: "cover" }} alt="Charts" />
                            <div className="card-body">
                                <h4>Advanced Charts</h4>
                                <p>Monthly contributions, language distribution, and activity insights.</p>
                                <button
                                    className="btn btn-primary w-100 mt-3"
                                    onClick={() => navigate("/HomePage")}
                                >
                                    Start Exploring with Charts
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: Trending & Explore */}
                    <div className="col-lg-4">
                        <div className="card h-100 shadow">
                            <img src={explore} className="card-img-top" style={{ height: "220px", objectFit: "cover" }} alt="Explore" />
                            <div className="card-body">
                                <h4>Trending Developers</h4>
                                <div className="mt-3">
                                    {["torvalds", "gaearon", "sindresorhus", "vercel", "facebook", "mui"].map((username, i) => (
                                        <button
                                            key={i}
                                            className="btn btn-outline-primary btn-sm me-2 mb-2"
                                            onClick={() => goToUser(username)}
                                        >
                                            @{username}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className="btn btn-success w-100 mt-3"
                                    onClick={() => navigate("/HomePage")}
                                >
                                    Discover More Users
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-5 pt-4 border-top">
                    <p className="text-muted">All features are fully functional • Data from GitHub API • Bookmarks saved in browser</p>
                </div>
            </div>
        </>
    );
};

export default Featurespage;