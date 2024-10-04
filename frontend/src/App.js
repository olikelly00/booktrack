import LandingPage from "./landingPage.js";
import Signup from "./signup.js";
import Login from "./login.js";
import HomePage from "./home.js";
import AdviseMe from "./adviseme.js";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";


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
          <Route path="/home" element={<RequireAuth> <HomePage /> </RequireAuth> } />
          <Route path="/adviseme" element={<RequireAuth> <AdviseMe /> </RequireAuth> } />
          {/* other routes... */}
        </Routes>
      </Router>
    </div>
  );
}



function RequireAuth({ children }) {
  const [auth, setAuth] = useState(null);
  const url = "http://localhost:3001/validatetoken";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          },
        });

        if (response.ok) {
          setAuth(true);
        } else if (response.status === 401 || response.status === 403) {
          setAuth(false);
        } else {
          console.log('Unexpected status:', response.status);
        }
      } catch (error) {
        console.log('Error during authentication:', error);
        setAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (auth === null) {
    return <div>Loading...</div>; // or some loading spinner
  }

  if (!auth) {
    return <Navigate to="/login"/>;
  }

  return children;
}
export default App;
