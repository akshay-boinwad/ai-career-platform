import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Roadmap.css";

function Roadmap() {
  const [roadmap, setRoadmap] = useState([]);
  const [currentSkills, setCurrentSkills] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [targetJobs, setTargetJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/roadmap/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Failed to load career roadmap.");
        return;
      }

      setRoadmap(data.roadmap || []);
      setCurrentSkills(data.current_skills || []);
      setSkillsToLearn(data.skills_to_learn || []);
      setTargetJobs(data.target_jobs || []);
    } catch (error) {
      console.error("Roadmap error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const getStageIcon = (stage) => {
    if (stage === "Foundation") return "🌱";
    if (stage === "Intermediate") return "🚀";
    if (stage === "Advanced") return "🏆";

    return "📚";
  };

  return (
    <div className="roadmap-page">

      {/* =========================
          SHARED SIDEBAR
      ========================= */}

      <Sidebar />

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="roadmap-main">

        <header className="roadmap-header">
          <div>
            <h1>Career Roadmap</h1>

            <p>
              Follow a personalized learning path to reach your
              career goals.
            </p>
          </div>
        </header>

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="roadmap-loading">
            <div className="loading-spinner"></div>

            <p>
              Building your career roadmap...
            </p>
          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}

        {error && !loading && (
          <div className="roadmap-error">
            ⚠️ {error}
          </div>
        )}

        {/* =========================
            ROADMAP DATA
        ========================= */}

        {!loading && !error && (
          <>

            {/* =========================
                HERO
            ========================= */}

            <section className="roadmap-hero">

              <div className="hero-badge">
                🗺️ PERSONALIZED CAREER PLAN
              </div>

              <h2>
                Build Your Path to
                <span> Career Success</span>
              </h2>

              <p>
                Your roadmap is based on your current skills
                and the skills required by recommended jobs.
              </p>

            </section>

            {/* =========================
                STATS
            ========================= */}

            <section className="roadmap-stats">

              <div className="roadmap-stat-card">

                <div className="stat-icon">
                  💡
                </div>

                <div>
                  <strong>
                    {currentSkills.length}
                  </strong>

                  <span>
                    Current Skills
                  </span>
                </div>

              </div>

              <div className="roadmap-stat-card">

                <div className="stat-icon">
                  📚
                </div>

                <div>
                  <strong>
                    {skillsToLearn.length}
                  </strong>

                  <span>
                    Skills to Learn
                  </span>
                </div>

              </div>

              <div className="roadmap-stat-card">

                <div className="stat-icon">
                  💼
                </div>

                <div>
                  <strong>
                    {targetJobs.length}
                  </strong>

                  <span>
                    Target Jobs
                  </span>
                </div>

              </div>

            </section>

            {/* =========================
                CURRENT SKILLS
            ========================= */}

            <section className="roadmap-card">

              <div className="card-heading">

                <div>
                  <span className="section-label">
                    YOUR FOUNDATION
                  </span>

                  <h2>
                    Current Skills
                  </h2>
                </div>

                <div className="heading-icon">
                  ✅
                </div>

              </div>

              {currentSkills.length > 0 ? (

                <div className="skill-list">

                  {currentSkills.map(
                    (skill, index) => (
                      <span
                        className="current-skill"
                        key={index}
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              ) : (

                <p className="empty-text">
                  No skills found in your resume.
                </p>

              )}

            </section>

            {/* =========================
                LEARNING ROADMAP
            ========================= */}

            <section className="roadmap-card roadmap-learning">

              <div className="card-heading">

                <div>
                  <span className="section-label">
                    YOUR LEARNING JOURNEY
                  </span>

                  <h2>
                    Skills to Learn
                  </h2>
                </div>

                <div className="heading-icon">
                  🎯
                </div>

              </div>

              {roadmap.length > 0 ? (

                <div className="timeline">

                  {roadmap.map(
                    (item, index) => (

                      <div
                        className="timeline-item"
                        key={item.step}
                      >

                        <div className="timeline-line"></div>

                        <div className="timeline-number">
                          {item.step}
                        </div>

                        <div className="timeline-content">

                          <div className="timeline-top">

                            <div>
                              <span className="stage-label">
                                {getStageIcon(item.stage)}{" "}
                                {item.stage}
                              </span>

                              <h3>
                                Learn {item.skill}
                              </h3>
                            </div>

                            <span className="step-badge">
                              Step {item.step}
                            </span>

                          </div>

                          <p>
                            {item.description}
                          </p>

                          <div className="roadmap-action">

                            <span>
                              📖 Build this skill through
                              practice and projects
                            </span>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="complete-roadmap">

                  <div className="complete-icon">
                    🎉
                  </div>

                  <h3>
                    You're Ready!
                  </h3>

                  <p>
                    Your current skills already match the
                    available job requirements.
                  </p>

                </div>

              )}

            </section>

            {/* =========================
                TARGET JOBS
            ========================= */}

            <section className="roadmap-card">

              <div className="card-heading">

                <div>
                  <span className="section-label">
                    CAREER TARGET
                  </span>

                  <h2>
                    Target Jobs
                  </h2>
                </div>

                <div className="heading-icon">
                  💼
                </div>

              </div>

              {targetJobs.length > 0 ? (

                <div className="target-jobs">

                  {targetJobs.map(
                    (job) => (

                      <div
                        className="target-job"
                        key={job.id}
                      >

                        <div className="job-icon">
                          💼
                        </div>

                        <div>
                          <h3>
                            {job.title}
                          </h3>

                          <p>
                            {job.company}
                          </p>
                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="empty-text">
                  No target jobs available.
                </p>

              )}

            </section>

            {/* =========================
                BOTTOM CTA
            ========================= */}

            <section className="roadmap-cta">

              <div>
                <h2>
                  Ready to improve your skills?
                </h2>

                <p>
                  Explore recommended jobs and identify
                  the skills employers are looking for.
                </p>
              </div>

              <Link
                to="/jobs"
                className="roadmap-cta-button"
              >
                Explore Jobs →
              </Link>

            </section>

          </>
        )}

      </main>

    </div>
  );
}

export default Roadmap;