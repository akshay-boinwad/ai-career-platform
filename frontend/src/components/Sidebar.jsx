import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import FloatingCareerAssistant from "./FloatingCareerAssistant";

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="career-sidebar">
      <Link
  to="/dashboard"
  className="career-sidebar-logo"
>
  Career<span>AI</span>
</Link>

      <nav className="career-sidebar-menu">

        <Link
          to="/dashboard"
          className={`career-menu-item ${
            isActive("/dashboard") ? "active" : ""
          }`}
        >
          <span>🏠</span>
          Dashboard
        </Link>

        <Link
          to="/resume"
          className={`career-menu-item ${
            isActive("/resume") ? "active" : ""
          }`}
        >
          <span>📄</span>
          Resume Analysis
        </Link>

        <Link
          to="/jobs"
          className={`career-menu-item ${
            isActive("/jobs") ? "active" : ""
          }`}
        >
          <span>💼</span>
          Job Recommendations
        </Link>

        <Link
          to="/applications"
          className={`career-menu-item ${
            isActive("/applications") ? "active" : ""
          }`}
        >
          <span>📋</span>
          Application Tracker
        </Link>

        <Link
          to="/skills"
          className={`career-menu-item ${
            isActive("/skills") ? "active" : ""
          }`}
        >
          <span>📊</span>
          Skill Gap Analysis
        </Link>

        <Link
          to="/interview"
          className={`career-menu-item ${
            isActive("/interview") ? "active" : ""
          }`}
        >
          <span>🎤</span>
          Mock Interview
        </Link>

        <Link
          to="/roadmap"
          className={`career-menu-item ${
            isActive("/roadmap") ? "active" : ""
          }`}
        >
          <span>🗺️</span>
          Career Roadmap
        </Link>

        <Link
          to="/profile"
          className={`career-menu-item ${
            isActive("/profile") ? "active" : ""
          }`}
        >
          <span>👤</span>
          My Profile
        </Link>

      </nav>

      <Link to="/dashboard" className="career-back-dashboard">
        ← Back to Dashboard
      </Link>

      <FloatingCareerAssistant />

    </aside>
  );
}

export default Sidebar;