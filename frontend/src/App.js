import LandingPage from "./landingPage.js";
import Signup from "./signup.js";
import Login from "./login.js";
import HomePage from "./home.js";
import AdviseMe from "./adviseme.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import "./index.css";

function App() {
  return (
    <div className="App">
      {/* <Home/>
      <Signup/> */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/adviseme" element={<AdviseMe />} />
          {/* other routes... */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
