import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import FloatingCareerAssistant from "./FloatingCareerAssistant";

function Sidebar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="mobile-career-header">
        <button
          className="mobile-menu-button"
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          aria-label="Open navigation menu"
        >
          ☰
        </button>

        <Link
          to="/dashboard"
          className="mobile-career-logo"
        >
          Career<span>AI</span>
        </Link>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={closeMobileMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`career-sidebar ${
          mobileMenuOpen ? "mobile-sidebar-open" : ""
        }`}
      >
        {/* LOGO */}
        <Link
          to="/dashboard"
          className="career-sidebar-logo"
          onClick={closeMobileMenu}
        >
          Career<span>AI</span>
        </Link>

        {/* MOBILE CLOSE BUTTON */}
        <button
          className="mobile-sidebar-close"
          onClick={closeMobileMenu}
          aria-label="Close navigation menu"
        >
          ✕
        </button>

        {/* MENU */}
        <nav className="career-sidebar-menu">

          <Link
            to="/dashboard"
            className={`career-menu-item ${
              isActive("/dashboard") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            <span>🏠</span>
            Dashboard
          </Link>

          <Link
            to="/resume"
            className={`career-menu-item ${
              isActive("/resume") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            <span>📄</span>
            Resume Analysis
          </Link>

          <Link
            to="/jobs"
            className={`career-menu-item ${
              isActive("/jobs") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            <span>💼</span>
            Job Recommendations
          </Link>

          <Link
            to="/applications"
            className={`career-menu-item ${
              isActive("/applications") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            <span>📋</span>
            Application Tracker
          </Link>

          <Link
            to="/skills"
            className={`career-menu-item ${
              isActive("/skills") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            <span>📊</span>
            Skill Gap Analysis
          </Link>

          <Link
            to="/interview"
            className={`career-menu-item ${
              isActive("/interview") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            <span>🎤</span>
            Mock Interview
          </Link>

          <Link
            to="/roadmap"
            className={`career-menu-item ${
              isActive("/roadmap") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            <span>🗺️</span>
            Career Roadmap
          </Link>

          <Link
            to="/profile"
            className={`career-menu-item ${
              isActive("/profile") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            <span>👤</span>
            My Profile
          </Link>

        </nav>

        {/* BACK TO DASHBOARD */}
        <Link
          to="/dashboard"
          className="career-back-dashboard"
          onClick={closeMobileMenu}
        >
          ← Back to Dashboard
        </Link>

        {/* AI ASSISTANT */}
        <FloatingCareerAssistant />
      </aside>
    </>
  );
}

export default Sidebar;