import Home from "./landingPage.js";
import Signup from "./signup.js";
import Login from "./login.js";
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
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* other routes... */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
