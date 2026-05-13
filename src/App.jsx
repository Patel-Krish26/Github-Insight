import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import AuthOptionsPage from "./Pages/Signinmethods.jsx";
import HomePage from "./Pages/HomePage.jsx";
import Userprofilepage from "./Pages/Userprofilepage.jsx";
import Userdetail from "./Pages/Userdetail.jsx";
import Featurespage from "./Pages/Featurespage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthOptionsPage />} />

                <Route path="/HomePage" element={<SignedIn><HomePage /></SignedIn>} />

                <Route path="/userprofile/:userid" element={<SignedIn><Userprofilepage /></SignedIn>} />

                {/* FIXED ROUTE - Only username needed */}
                <Route path="/userdetail/:username" element={<SignedIn><Userdetail /></SignedIn>} />

                <Route path="/Featurespage" element={<Featurespage />} />

                <Route path="*" element={<SignedOut><RedirectToSignIn /></SignedOut>} />
            </Routes>
        </Router>
    );
}

export default App;