import React, { useState, useEffect } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";

const AuthOptionsPage = () => {
    const [mode, setMode] = useState("signup");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) {
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
        <div className="container text-center mt-5">
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" style={{ width: "80px", height: "80px", marginBottom: "20px" }} />
            <h1 className="mb-4">Github Insights</h1>
            <p className="lead mb-4">Discover GitHub users, contributions & repositories</p>

            <div className="row justify-content-center">
                <div className="col-md-4">
                    {mode === "signin" ? (
                        <SignIn
                            fallbackRedirectUrl="/HomePage"
                            forceRedirectUrl="/HomePage"
                        />
                    ) : (
                        <SignUp
                            fallbackRedirectUrl="/HomePage"
                            forceRedirectUrl="/HomePage"
                        />
                    )}

                    <button
                        className="btn btn-secondary mt-4 w-100"
                        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                    >
                        {mode === "signin" ? "Need an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthOptionsPage;