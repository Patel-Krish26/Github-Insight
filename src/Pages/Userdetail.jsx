import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import Navbar from "../Componets/Navbar.jsx";
import { useUser } from "@clerk/clerk-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Userdetail = () => {
    const [user, setUser] = useState({});
    const [repos, setRepos] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [monthlyContributions, setMonthlyContributions] = useState({});
    const [activities, setActivities] = useState([]);
    const [heatmapData, setHeatmapData] = useState({}); // NEW: Heatmap data
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(true);

    const { username } = useParams();
    const { user: clerkUser } = useUser();

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [userRes, repoRes, eventRes, orgRes] = await Promise.all([
                    axios.get(`https://api.github.com/users/${username}`),
                    axios.get(`https://api.github.com/users/${username}/repos?per_page=8&sort=updated`),
                    axios.get(`https://api.github.com/users/${username}/events?per_page=60`),
                    axios.get(`https://api.github.com/users/${username}/orgs`)
                ]);

                setUser(userRes.data);
                setRepos(repoRes.data);
                setOrganizations(orgRes.data);
                setActivities(eventRes.data);

                // Monthly Contributions
                const monthly = {};
                const heatMap = {}; // Simple day-based heatmap (last 90 days approx)

                eventRes.data.forEach(event => {
                    if (!event.created_at) return;
                    const date = new Date(event.created_at);
                    const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

                    if (!monthly[monthKey]) monthly[monthKey] = { commits: 0, prs: 0 };
                    if (!heatMap[dayKey]) heatMap[dayKey] = 0;

                    if (event.type === "PushEvent") {
                        monthly[monthKey].commits += event.payload?.size || 1;
                        heatMap[dayKey] += 1;
                    } else if (event.type === "PullRequestEvent" && event.payload?.action === "opened") {
                        monthly[monthKey].prs++;
                        heatMap[dayKey] += 1;
                    }
                });

                setMonthlyContributions(monthly);
                setHeatmapData(heatMap);

                // Bookmark
                const saved = JSON.parse(localStorage.getItem('githubBookmarks') || '[]');
                setIsBookmarked(saved.some(b => b.login === username));

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [username]);

    const toggleBookmark = () => {
        if (!clerkUser) return alert("Please sign in");
        let bookmarks = JSON.parse(localStorage.getItem('githubBookmarks') || '[]');
        if (isBookmarked) {
            bookmarks = bookmarks.filter(b => b.login !== username);
        } else {
            bookmarks.push({ login: username, avatar_url: user.avatar_url });
        }
        localStorage.setItem('githubBookmarks', JSON.stringify(bookmarks));
        setIsBookmarked(!isBookmarked);
    };

    // Language Pie
    const languageData = {
        labels: Object.keys(repos.reduce((acc, repo) => {
            if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
            return acc;
        }, {})),
        datasets: [{
            data: Object.values(repos.reduce((acc, repo) => {
                if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
                return acc;
            }, {})), backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]
        }]
    };

    // Simple Heatmap Component (GitHub-style squares)
    const ContributionHeatmap = () => {
        const days = Object.keys(heatmapData).sort().slice(-90); // Last ~90 days
        const maxCount = Math.max(...Object.values(heatmapData), 1);

        return (
            <div className="d-flex flex-wrap gap-1" style={{ maxWidth: "420px" }}>
                {days.map((day, i) => {
                    const count = heatmapData[day] || 0;
                    const intensity = Math.min(Math.floor((count / maxCount) * 4), 4);
                    const colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
                    return (
                        <div
                            key={i}
                            title={`${day}: ${count} contributions`}
                            style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: colors[intensity],
                                borderRadius: "2px"
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    if (loading) return <div className="text-center mt-5"><img src="https://github.githubassets.com/images/spinners/octocat-spinner-128.gif" alt="Loading..." /></div>;

    return (
        <>
            <Navbar />

            <div className="container mt-5">
                {/* Header */}
                <header className="bg-dark text-white py-5 text-center rounded-3 mb-5">
                    <img src={user.avatar_url} className="rounded-circle mb-4" style={{ width: "180px", height: "180px", objectFit: "cover", border: "6px solid white" }} alt="" />
                    <h1>{user.name || user.login}</h1>
                    <h4 className="text-light">@{user.login}</h4>
                    <p className="lead">Followers: {user.followers} • Following: {user.following} • Repos: {user.public_repos}</p>
                    <button onClick={toggleBookmark} className={`btn btn-lg mt-3 ${isBookmarked ? "btn-danger" : "btn-outline-light"}`}>
                        {isBookmarked ? "★ Remove Bookmark" : "☆ Bookmark User"}
                    </button>
                </header>

                <div className="row">
                    <div className="col-lg-4">
                        {/* Bio */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5>Bio</h5><p>{user.bio || "No bio available"}</p>
                                <h5>Location</h5><p>{user.location || "Not specified"}</p>
                            </div>
                        </div>

                        {/* Organizations */}
                        {organizations.length > 0 && (
                            <div className="card mb-4">
                                <div className="card-header">Organizations</div>
                                <div className="card-body">
                                    {organizations.map((org, i) => (
                                        <a key={i} href={org.html_url} target="_blank" className="btn btn-sm btn-outline-secondary me-2 mb-2">{org.login}</a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        <div className="card">
                            <div className="card-header">Top Languages</div>
                            <div className="card-body"><Pie data={languageData} /></div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        {/* Repos */}
                        <h4>Recent Repositories</h4>
                        {repos.map(repo => (
                            <div key={repo.id} className="card mb-3">
                                <div className="card-body">
                                    <h5><a href={repo.html_url} target="_blank">{repo.name}</a></h5>
                                    <p className="text-muted">{repo.description}</p>
                                    <button className="btn btn-sm btn-primary" onClick={() => window.open(repo.html_url, "_blank")}>View Repo</button>
                                </div>
                            </div>
                        ))}

                        {/* Monthly Bar Chart */}
                        <div className="card mt-4 mb-4">
                            <div className="card-header">Monthly Contributions</div>
                            <div className="card-body" style={{ height: "300px" }}>
                                <Bar data={{
                                    labels: Object.keys(monthlyContributions), datasets: [
                                        { label: "Commits", data: Object.values(monthlyContributions).map(c => c.commits), backgroundColor: "#36A2EB" },
                                        { label: "PRs", data: Object.values(monthlyContributions).map(c => c.prs), backgroundColor: "#FF6384" }
                                    ]
                                }} />
                            </div>
                        </div>

                        {/* NEW: Contribution Heatmap */}
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between">
                                <span>Contribution Heatmap (Recent Activity)</span>
                                <small className="text-muted">Darker = More contributions</small>
                            </div>
                            <div className="card-body">
                                <ContributionHeatmap />
                            </div>
                        </div>

                        {/* Activity Timeline (kept from before) */}
                        {/* ... (you can keep the timeline if you want, or remove it) */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Userdetail;