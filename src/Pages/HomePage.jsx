import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Componets/Navbar.jsx";
import { useUser } from "@clerk/clerk-react";

const HomePage = () => {
    const [input, setInput] = useState("");
    const [searchUsers, setSearchUsers] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

    const [searchParams] = useSearchParams();
    const { user, isLoaded } = useUser();

    const trendingUsers = ["torvalds", "gaearon", "sindresorhus", "vercel", "facebook", "mui"];

    useEffect(() => {
        const query = searchParams.get("search");
        if (query) {
            setInput(query);
            handleSearch(query);
        }

        setBookmarks(JSON.parse(localStorage.getItem("githubBookmarks") || "[]"));
        setSearchHistory(JSON.parse(localStorage.getItem("searchHistory") || "[]"));
    }, [searchParams]);

    const saveToHistory = (term) => {
        let history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        if (!history.includes(term)) {
            history = [term, ...history].slice(0, 6);
            localStorage.setItem("searchHistory", JSON.stringify(history));
            setSearchHistory(history);
        }
    };

    const handleSearch = async (term = input) => {
        if (!term.trim()) return;
        setLoading(true);
        setSearchUsers([]);

        try {
            const res = await axios.get(
                `https://api.github.com/search/users?q=${encodeURIComponent(term)}&per_page=9&sort=followers&order=desc`
            );

            const detailedUsers = await Promise.all(
                res.data.items.map(async (u) => {
                    const detail = await axios.get(`https://api.github.com/users/${u.login}`);
                    return detail.data;
                })
            );

            setSearchUsers(detailedUsers);
            setTotalResults(res.data.total_count);
            saveToHistory(term);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                alert("GitHub API rate limit reached. Please wait before searching again.");
            } else {
                alert("Search failed. Please try again.");
            }
        }
        setLoading(false);
    };

    if (!isLoaded) return <div className="text-center mt-5">Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="text-center mb-5">
                    <h1 className="display-3 fw-bold">Discover GitHub</h1>
                    <p className="lead">Search • Explore • Bookmark • Visualize</p>
                </div>

                {/* Search Bar */}
                <div className="row justify-content-center mb-4">
                    <div className="col-md-8">
                        <div className="input-group input-group-lg">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search GitHub username..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button className="btn btn-primary px-4" onClick={() => handleSearch()} disabled={loading}>
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                        <small className="text-muted d-block mt-2">
                            Tip: Try "torvalds" or "followers:&gt;1000 location:India"
                        </small>
                    </div>
                </div>

                {/* Recent Searches */}
                {searchHistory.length > 0 && (
                    <div className="mb-4">
                        <h5>Recent Searches</h5>
                        {searchHistory.map((term, i) => (
                            <button
                                key={i}
                                className="btn btn-sm btn-outline-secondary me-2 mb-2"
                                onClick={() => { setInput(term); handleSearch(term); }}
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                )}

                {/* My Bookmarks */}
                {bookmarks.length > 0 && (
                    <div className="mb-5">
                        <h4>My Bookmarks</h4>
                        <div className="row g-3">
                            {bookmarks.slice(0, 6).map((b, i) => (
                                <div key={i} className="col-md-2 col-4">
                                    <Link to={`/userdetail/${b.login}`} className="text-decoration-none">
                                        <div className="card text-center h-100">
                                            <img src={b.avatar_url} className="card-img-top rounded-circle mx-auto mt-3" style={{ width: "70px" }} alt="" />
                                            <div className="card-body p-2"><strong>{b.login}</strong></div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {searchUsers.length > 0 && (
                    <>
                        <h4 className="mb-3">Search Results ({totalResults})</h4>
                        <div className="row g-4">
                            {searchUsers.map((u) => (
                                <div key={u.id} className="col-md-4 mb-4">
                                    <Link to={`/userdetail/${u.login}`} className="text-decoration-none">
                                        <div className="card h-100">
                                            <img src={u.avatar_url} className="card-img-top" alt={u.login} />
                                            <div className="card-body">
                                                <h5>{u.login}</h5>
                                                {u.name && <p className="text-muted">{u.name}</p>}
                                                <p className="small text-muted">{u.bio ? u.bio.substring(0, 85) + "..." : ""}</p>
                                                <p>Followers: {u.followers} • Repos: {u.public_repos}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Trending */}
                <h4 className="mt-5 mb-3">🔥 Trending Developers</h4>
                <div className="row g-3">
                    {trendingUsers.map((login) => (
                        <div key={login} className="col-md-3 col-6">
                            <Link to={`/userdetail/${login}`} className="btn btn-outline-primary w-100 py-3">@{login}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HomePage;