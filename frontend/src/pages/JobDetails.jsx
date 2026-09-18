import { Link, useLocation } from "react-router-dom";
import "./JobDetails.css";

function JobDetails() {
  const location = useLocation();

  const job = location.state?.job;

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="job-details-empty">
          <h2>Job details not found</h2>
          <p>Please go back and select a job again.</p>

          <Link to="/jobs" className="back-jobs-button">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  // Apply for job
  const handleApply = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login again to apply for this job.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications/${job.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Application submitted successfully! 🎉");
      } else {
        alert(data.detail || "Failed to apply for this job.");
      }
    } catch (error) {
      console.error("Application error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="job-details-page">

      <aside className="sidebar">
        <div className="dashboard-logo">
          Career<span>AI</span>
        </div>

        <div className="sidebar-menu">

          <Link to="/dashboard" className="menu-item">
            <span>🏠</span> Dashboard
          </Link>

          <Link to="/resume" className="menu-item">
            <span>📄</span> Resume Analysis
          </Link>

          <Link to="/jobs" className="menu-item active">
            <span>💼</span> Job Recommendations
          </Link>

          <Link to="/skills" className="menu-item">
            <span>📊</span> Skill Gap Analysis
          </Link>

          <Link to="/interview" className="menu-item">
            <span>🎤</span> Mock Interview
          </Link>

          <Link to="/profile" className="menu-item">
            <span>👤</span> My Profile
          </Link>

        </div>

        <Link to="/jobs" className="back-dashboard">
          ← Back to Jobs
        </Link>
      </aside>

      <main className="job-details-main">

        <Link to="/jobs" className="back-link">
          ← Back to Job Recommendations
        </Link>

        <section className="job-details-card">

          <div className="job-details-top">

            <div className="job-details-icon">
              💼
            </div>

            <div>
              <span className="job-details-type">
                {job.job_type || "Full-time"}
              </span>

              <h1>{job.title}</h1>

              <h2>{job.company}</h2>

              <p className="details-location">
                📍 {job.location || "Location not specified"}
              </p>
            </div>

          </div>

          <div className="details-match">
            <span>🎯 Your Match</span>
            <strong>{job.match_score}%</strong>
          </div>

          <div className="details-section">
            <h3>📋 Job Description</h3>

            <p>
              {job.description ||
                "No job description available."}
            </p>
          </div>

          <div className="details-section">
            <h3>🛠️ Required Skills</h3>

            <div className="details-skills">
              {job.skills &&
                job.skills.split(",").map((skill, index) => (
                  <span key={index}>
                    {skill.trim()}
                  </span>
                ))}
            </div>
          </div>

          {job.matched_skills &&
            job.matched_skills.length > 0 && (
              <div className="details-section matched-details">
                <h3>✓ Skills You Have</h3>

                <div className="details-skills">
                  {job.matched_skills.map((skill, index) => (
                    <span key={index}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {job.missing_skills &&
            job.missing_skills.length > 0 && (
              <div className="details-section missing-details">
                <h3>⚠️ Skills to Learn</h3>

                <div className="details-skills">
                  {job.missing_skills.map((skill, index) => (
                    <span key={index}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          <div className="job-details-footer">

            <div>
              <span>Experience</span>
              <strong>
                {job.experience || "Any"}
              </strong>
            </div>

            <button
              className="apply-button"
              onClick={handleApply}
            >
              Apply Now →
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default JobDetails;