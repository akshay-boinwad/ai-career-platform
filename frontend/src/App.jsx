import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Resume from "./pages/Resume";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Applications from "./pages/Applications";
import Skills from "./pages/Skills";
import Interview from "./pages/Interview";
import Roadmap from "./pages/Roadmap";
import Profile from "./pages/Profile";
import CareerAssistant from "./pages/CareerAssistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/resume" element={<Resume />} />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="/applications" element={<Applications />} />

        <Route path="/skills" element={<Skills />} />

        <Route path="/interview" element={<Interview />} />

        <Route path="/roadmap" element={<Roadmap />} />

        <Route
          path="/career-assistant"
          element={<CareerAssistant />}
        />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;