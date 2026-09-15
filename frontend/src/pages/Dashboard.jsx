import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [dashboardData, setDashboardData] = useState({
    resume_score: null,
    job_matches: 0,
    skills_to_improve: 0,
    interviews: 0,
  });

  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/dashboard/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Dashboard API error:",
            data.detail || "Failed to load dashboard."
          );
          return;
        }

        setDashboardData({
          resume_score: data.resume_score,
          job_matches: data.job_matches || 0,
          skills_to_improve: data.skills_to_improve || 0,
          interviews: data.interviews || 0,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-page">

      {/* =========================
          SHARED SIDEBAR
      ========================= */}

      <Sidebar />

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="dashboard-main">

        {/* TOP BAR */}

        <header className="dashboard-header">

          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome back! Here's your career overview.
            </p>
          </div>

          <div className="profile-small">

            <div className="profile-avatar">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <strong>
                {user.name || "User"}
              </strong>

              <span>
                {user.email || "user@example.com"}
              </span>
            </div>

          </div>

        </header>


        {/* =========================
            WELCOME CARD
        ========================= */}

        <section className="welcome-card">

          <div>

            <span className="welcome-badge">
              ✨ AI Career Assistant
            </span>

            <h2>
              Ready to build your <span>career?</span>
            </h2>

            <p>
              Analyze your resume, discover opportunities and improve your
              skills with AI-powered career guidance.
            </p>

            <Link
              to="/resume"
              className="welcome-button"
            >
              Analyze My Resume →
            </Link>

          </div>

          <div className="welcome-icon">
            🚀
          </div>

        </section>


        {/* =========================
            STAT CARDS
        ========================= */}

        <section className="stats-grid">

          {/* RESUME SCORE */}

          <div className="stat-card">

            <div className="stat-icon blue">
              📄
            </div>

            <div>
              <span>
                Resume Score
              </span>

              <h3>
                {loading
                  ? "..."
                  : dashboardData.resume_score !== null
                  ? `${dashboardData.resume_score}%`
                  : "--"}
              </h3>

              <small>
                {dashboardData.resume_score !== null
                  ? "Latest resume ATS score"
                  : "Upload resume to analyze"}
              </small>
            </div>

          </div>


          {/* JOB MATCHES */}

          <div className="stat-card">

            <div className="stat-icon green">
              💼
            </div>

            <div>
              <span>
                Job Matches
              </span>

              <h3>
                {loading
                  ? "..."
                  : dashboardData.job_matches}
              </h3>

              <small>
                Personalized opportunities
              </small>
            </div>

          </div>


          {/* SKILLS TO IMPROVE */}

          <div className="stat-card">

            <div className="stat-icon purple">
              📊
            </div>

            <div>
              <span>
                Skills to Improve
              </span>

              <h3>
                {loading
                  ? "..."
                  : dashboardData.skills_to_improve}
              </h3>

              <small>
                Skills identified from job gaps
              </small>
            </div>

          </div>


          {/* INTERVIEWS */}

          <div className="stat-card">

            <div className="stat-icon orange">
              🎤
            </div>

            <div>
              <span>
                Interviews
              </span>

              <h3>
                {loading
                  ? "..."
                  : dashboardData.interviews}
              </h3>

              <small>
                Completed practice sessions
              </small>
            </div>

          </div>

        </section>


        {/* =========================
            FEATURES
        ========================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <h2>
                Career Tools
              </h2>

              <p>
                Everything you need to become job-ready.
              </p>

            </div>

          </div>


          <div className="tools-grid">

            {/* RESUME */}

            <Link
              to="/resume"
              className="tool-card"
            >

              <div className="tool-icon blue-tool">
                📄
              </div>

              <div>

                <h3>
                  Resume Analysis
                </h3>

                <p>
                  Upload your resume and get an AI-powered ATS score,
                  strengths and improvement suggestions.
                </p>

                <span>
                  Analyze Resume →
                </span>

              </div>

            </Link>


            {/* JOBS */}

            <Link
              to="/jobs"
              className="tool-card"
            >

              <div className="tool-icon green-tool">
                💼
              </div>

              <div>

                <h3>
                  Job Recommendations
                </h3>

                <p>
                  Discover jobs that match your skills, experience and
                  career goals.
                </p>

                <span>
                  Explore Jobs →
                </span>

              </div>

            </Link>


            {/* APPLICATION TRACKER */}

            <Link
              to="/applications"
              className="tool-card"
            >

              <div className="tool-icon blue-tool">
                📋
              </div>

              <div>

                <h3>
                  Application Tracker
                </h3>

                <p>
                  Track your job applications, application status and
                  the dates you applied.
                </p>

                <span>
                  Track Applications →
                </span>

              </div>

            </Link>


            {/* SKILL GAP */}

            <Link
              to="/skills"
              className="tool-card"
            >

              <div className="tool-icon purple-tool">
                📊
              </div>

              <div>

                <h3>
                  Skill Gap Analysis
                </h3>

                <p>
                  Identify missing skills and understand what you need
                  to improve for your target career.
                </p>

                <span>
                  Analyze Skills →
                </span>

              </div>

            </Link>


            {/* MOCK INTERVIEW */}

            <Link
              to="/interview"
              className="tool-card"
            >

              <div className="tool-icon orange-tool">
                🎤
              </div>

              <div>

                <h3>
                  AI Mock Interview
                </h3>

                <p>
                  Practice realistic interviews and receive AI-powered
                  feedback on your performance.
                </p>

                <span>
                  Start Interview →
                </span>

              </div>

            </Link>


            {/* CAREER ROADMAP */}

            <Link
              to="/roadmap"
              className="tool-card"
            >

              <div className="tool-icon blue-tool">
                🗺️
              </div>

              <div>

                <h3>
                  Career Roadmap
                </h3>

                <p>
                  Follow a personalized learning path and build the
                  skills needed for your target career.
                </p>

                <span>
                  View Roadmap →
                </span>

              </div>

            </Link>


            {/* AI CAREER ASSISTANT */}

            <Link
              to="/career-assistant"
              className="tool-card"
            >

              <div className="tool-icon purple-tool">
                🤖
              </div>

              <div>

                <h3>
                  AI Career Assistant
                </h3>

                <p>
                  Ask CareerAI about your resume, skills, jobs,
                  interviews and personalized career planning.
                </p>

                <span>
                  Ask CareerAI →
                </span>

              </div>

            </Link>

          </div>

        </section>


        {/* =========================
            GET STARTED
        ========================= */}

        <section className="next-step-card">

          <div>

            <h2>
              Your next step
            </h2>

            <p>
              Start by uploading your resume. CareerAI will analyze it
              and help you understand where you stand.
            </p>

          </div>

          <Link
            to="/resume"
            className="next-step-button"
          >
            Upload Resume →
          </Link>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;