import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";

const Navbar = () => {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const location = useLocation();

    const isActive = (path) => location.pathname.includes(path);

    if (!isLoaded) return <nav className="navbar navbar-expand-lg navbar-dark bg-dark"><div className="container">Loading...</div></nav>;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/HomePage">
                    <img
                        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                        alt="GitHub"
                        style={{ height: "38px", marginRight: "10px" }}
                    />
                    <span style={{ fontSize: "26px", fontWeight: "700" }}>Github Insights</span>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link to="/HomePage" className={`nav-link ${isActive('/HomePage') ? 'active fw-bold' : ''}`}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Featurespage" className={`nav-link ${isActive('/Featurespage') ? 'active fw-bold' : ''}`}>Features</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={`/userprofile/${user?.id}`} className={`nav-link ${isActive('/userprofile') ? 'active fw-bold' : ''}`}>My Profile</Link>
                        </li>

                        {user ? (
                            <>
                                <li className="nav-item ms-3">
                                    <button
                                        onClick={() => signOut({ redirectUrl: '/' })}
                                        className="btn btn-outline-light"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item ms-3">
                                <Link to="/" className="btn btn-primary">Sign In</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;