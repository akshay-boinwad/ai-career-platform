import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  // =====================================================
  // FETCH CAREERAI JOBS
  // =====================================================

  const fetchJobs = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Please login to view job recommendations.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/jobs/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load jobs."
        );
      }

      const jobList = data.jobs || [];

      setJobs(jobList);
      setFilteredJobs(jobList);

    } catch (error) {
      console.error("Jobs error:", error);

      setError(
        error.message ||
          "Unable to connect to the CareerAI server."
      );

      setJobs([]);
      setFilteredJobs([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD JOBS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchJobs();
  }, []);

  // =====================================================
  // SEARCH JOBS
  // =====================================================

  const handleSearch = () => {
    const searchKeyword = keyword
      .trim()
      .toLowerCase();

    const searchLocation = location
      .trim()
      .toLowerCase();

    const filtered = jobs.filter((job) => {

      const title =
        job.title?.toLowerCase() || "";

      const company =
        job.company?.toLowerCase() || "";

      const jobLocation =
        job.location?.toLowerCase() || "";

      const description =
        job.description?.toLowerCase() || "";

      const skills =
        job.skills?.toLowerCase() || "";

      const keywordMatch =
        !searchKeyword ||
        title.includes(searchKeyword) ||
        company.includes(searchKeyword) ||
        description.includes(searchKeyword) ||
        skills.includes(searchKeyword);

      const locationMatch =
        !searchLocation ||
        jobLocation.includes(searchLocation);

      return keywordMatch && locationMatch;
    });

    setFilteredJobs(filtered);
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {
    setKeyword("");
    setLocation("");
    setFilteredJobs(jobs);
  };

  // =====================================================
  // APPLY FOR JOB
  // =====================================================

  const handleApply = async (job) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login to apply for this job.");
      return;
    }

    const applyLink = job.application_url || "";

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/applications/${job.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          data.detail ===
          "You have already applied for this job."
        ) {
          alert("You have already applied for this job.");
        } else {
          alert(
            data.detail ||
              "Unable to save application."
          );
        }

        if (applyLink) {
          window.open(
            applyLink,
            "_blank",
            "noopener,noreferrer"
          );
        }

        return;
      }

      if (applyLink) {
        window.open(
          applyLink,
          "_blank",
          "noopener,noreferrer"
        );
      }

      alert(
        "Application saved! The original job page has been opened."
      );
    } catch (error) {
      console.error("Application error:", error);

      if (applyLink) {
        window.open(
          applyLink,
          "_blank",
          "noopener,noreferrer"
        );
      }
    }
  };

  // =====================================================
  // ENTER KEY SEARCH
  // =====================================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="jobs-page">

      {/* =========================
          SHARED SIDEBAR
      ========================= */}

      <Sidebar />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="jobs-main">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <header className="jobs-header">

          <div>

            <h1>
              Find Your <span>Next Opportunity</span>
            </h1>

            <p>
              Discover jobs matched to your skills,
              experience and career goals.
            </p>

          </div>

        </header>


        <section className="jobs-section">

          {/* =========================
              PAGE BADGE
          ========================= */}

          <div className="section-badge">
            ✨ CAREER OPPORTUNITIES
          </div>


          <h2>
            Explore <span>Recommended Jobs</span>
          </h2>


          <p className="jobs-description">
            Find opportunities that match your profile
            and discover the skills you need to grow.
          </p>


          {/* =================================================
              JOB SEARCH
          ================================================= */}

          <div className="live-jobs-section">

            <div className="live-jobs-heading">

              <div>

                <span className="live-badge">
                  🔵 CAREERAI JOBS
                </span>

                <h3>
                  Search Job Opportunities
                </h3>

                <p>
                  Search available opportunities by job
                  title, company, skills or location.
                </p>

              </div>

            </div>


            {/* =========================
                SEARCH BOX
            ========================= */}

            <div className="live-search-box">

              <div className="search-field">

                <label>
                  Job Title or Keyword
                </label>

                <input
                  type="text"
                  value={keyword}
                  onChange={(e) =>
                    setKeyword(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Python Developer"
                />

              </div>


              <div className="search-field">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Pune, Mumbai, Bengaluru"
                />

              </div>


              <button
                className="live-search-button"
                onClick={handleSearch}
                disabled={loading}
              >
                🔎 Search Jobs
              </button>

            </div>


            {/* =========================
                CLEAR SEARCH
            ========================= */}

            {!loading &&
              (keyword.trim() ||
                location.trim()) && (
                <div
                  style={{
                    marginTop: "14px",
                    textAlign: "right",
                  }}
                >
                  <button
                    onClick={clearSearch}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#60a5fa",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Clear Search
                  </button>
                </div>
              )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

              <div className="jobs-loading">

                🤖 Loading job opportunities...

              </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {!loading && error && (

              <div className="jobs-empty">

                <h3>
                  ⚠️ Unable to Load Jobs
                </h3>

                <p>
                  {error}
                </p>

                <button
                  className="live-search-button"
                  onClick={fetchJobs}
                  style={{
                    marginTop: "18px",
                  }}
                >
                  Try Again
                </button>

              </div>

            )}


            {/* =================================================
                NO JOBS
            ================================================= */}

            {!loading &&
              !error &&
              filteredJobs.length === 0 && (

                <div className="jobs-empty">

                  <h3>
                    No Job Opportunities Found
                  </h3>

                  <p>
                    Try another job title, skill or location.
                  </p>

                  {(keyword || location) && (
                    <button
                      className="live-search-button"
                      onClick={clearSearch}
                      style={{
                        marginTop: "18px",
                      }}
                    >
                      Show All Jobs
                    </button>
                  )}

                </div>

            )}


            {/* =================================================
                JOB RESULTS
            ================================================= */}

            {!loading &&
              !error &&
              filteredJobs.length > 0 && (

                <>

                  <div
                    style={{
                      marginBottom: "18px",
                      color: "#8f9bb5",
                      fontSize: "14px",
                    }}
                  >
                    Showing{" "}
                    <strong
                      style={{
                        color: "#ffffff",
                      }}
                    >
                      {filteredJobs.length}
                    </strong>{" "}
                    job opportunities
                  </div>


                  <div className="jobs-grid">

                    {filteredJobs.map(
                      (job, index) => {

                        const jobTitle =
                          job.title ||
                          "Job Opportunity";

                        const company =
                          job.company ||
                          "Company not specified";

                        const jobLocation =
                          job.location ||
                          "India";

                        const description =
                          job.description ||
                          "No description available.";

                        const applyLink =
                          job.application_url ||
                          "";

                        const jobSkills =
                          job.skills
                            ? job.skills
                                .split(",")
                                .map(
                                  (skill) =>
                                    skill.trim()
                                )
                                .filter(Boolean)
                            : [];

                        const matchedSkills =
                          job.matched_skills || [];

                        const missingSkills =
                          job.missing_skills || [];

                        const matchScore =
                          typeof job.match_score ===
                          "number"
                            ? job.match_score
                            : 0;

                        return (

                          <div
                            className="job-card live-job-card"
                            key={
                              job.id ||
                              index
                            }
                          >

                            {/* =========================
                                JOB TOP
                            ========================= */}

                            <div className="job-top">

                              <div className="job-icon">
                                💼
                              </div>

                              <span className="job-type">
                                {job.job_type ||
                                  "Job Opportunity"}
                              </span>

                            </div>


                            {/* =========================
                                TITLE
                            ========================= */}

                            <h3>
                              {jobTitle}
                            </h3>


                            {/* =========================
                                COMPANY
                            ========================= */}

                            <h4>
                              {company}
                            </h4>


                            {/* =========================
                                LOCATION
                            ========================= */}

                            <p className="job-location">

                              📍{" "}

                              {jobLocation}

                            </p>


                            {/* =========================
                                EXPERIENCE
                            ========================= */}

                            <p className="live-job-experience">

                              💼 Experience:{" "}

                              {job.experience ||
                                "Not specified"}

                            </p>


                            {/* =========================
                                AI MATCH SCORE
                            ========================= */}

                            <div
                              style={{
                                marginTop: "16px",
                                marginBottom: "16px",
                                padding: "12px 14px",
                                borderRadius: "10px",
                                background:
                                  "rgba(59, 130, 246, 0.08)",
                                border:
                                  "1px solid rgba(59, 130, 246, 0.18)",
                              }}
                            >

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent:
                                    "space-between",
                                  alignItems:
                                    "center",
                                  marginBottom: "8px",
                                }}
                              >

                                <span
                                  style={{
                                    color: "#aeb9d0",
                                    fontSize: "13px",
                                  }}
                                >
                                  🎯 AI Match Score
                                </span>

                                <strong
                                  style={{
                                    color: "#60a5fa",
                                    fontSize: "18px",
                                  }}
                                >
                                  {matchScore}%
                                </strong>

                              </div>


                              <div
                                style={{
                                  height: "6px",
                                  borderRadius: "10px",
                                  background: "#1b2a4a",
                                  overflow: "hidden",
                                }}
                              >

                                <div
                                  style={{
                                    width: `${matchScore}%`,
                                    height: "100%",
                                    borderRadius: "10px",
                                    background:
                                      "#3b82f6",
                                    transition:
                                      "width 0.4s ease",
                                  }}
                                />

                              </div>

                            </div>


                            {/* =========================
                                MATCHED SKILLS
                            ========================= */}

                            {matchedSkills.length > 0 && (

                              <div
                                style={{
                                  marginBottom: "14px",
                                }}
                              >

                                <strong
                                  style={{
                                    display:
                                      "block",
                                    color:
                                      "#86efac",
                                    fontSize:
                                      "13px",
                                    marginBottom:
                                      "8px",
                                  }}
                                >
                                  ✓ Skills You Have
                                </strong>

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    flexWrap:
                                      "wrap",
                                    gap: "6px",
                                  }}
                                >

                                  {matchedSkills.map(
                                    (
                                      skill,
                                      skillIndex
                                    ) => (

                                      <span
                                        key={
                                          skillIndex
                                        }
                                        style={{
                                          padding:
                                            "5px 9px",
                                          borderRadius:
                                            "6px",
                                          background:
                                            "rgba(34, 197, 94, 0.1)",
                                          border:
                                            "1px solid rgba(34, 197, 94, 0.2)",
                                          color:
                                            "#86efac",
                                          fontSize:
                                            "12px",
                                        }}
                                      >
                                        {skill}
                                      </span>

                                    )
                                  )}

                                </div>

                              </div>

                            )}


                            {/* =========================
                                MISSING SKILLS
                            ========================= */}

                            {missingSkills.length > 0 && (

                              <div
                                style={{
                                  marginBottom: "14px",
                                }}
                              >

                                <strong
                                  style={{
                                    display:
                                      "block",
                                    color:
                                      "#fbbf24",
                                    fontSize:
                                      "13px",
                                    marginBottom:
                                      "8px",
                                  }}
                                >
                                  ⚠️ Skills to Improve
                                </strong>

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    flexWrap:
                                      "wrap",
                                    gap: "6px",
                                  }}
                                >

                                  {missingSkills.map(
                                    (
                                      skill,
                                      skillIndex
                                    ) => (

                                      <span
                                        key={
                                          skillIndex
                                        }
                                        style={{
                                          padding:
                                            "5px 9px",
                                          borderRadius:
                                            "6px",
                                          background:
                                            "rgba(245, 158, 11, 0.1)",
                                          border:
                                            "1px solid rgba(245, 158, 11, 0.2)",
                                          color:
                                            "#fbbf24",
                                          fontSize:
                                            "12px",
                                        }}
                                      >
                                        {skill}
                                      </span>

                                    )
                                  )}

                                </div>

                              </div>

                            )}


                            {/* =========================
                                JOB SKILLS
                            ========================= */}

                            {jobSkills.length > 0 && (
                              <div
                                style={{
                                  marginBottom:
                                    "14px",
                                }}
                              >

                                <strong
                                  style={{
                                    display:
                                      "block",
                                    color:
                                      "#aeb9d0",
                                    fontSize:
                                      "13px",
                                    marginBottom:
                                      "8px",
                                  }}
                                >
                                  🛠 Required Skills
                                </strong>

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    flexWrap:
                                      "wrap",
                                    gap: "6px",
                                  }}
                                >

                                  {jobSkills.map(
                                    (
                                      skill,
                                      skillIndex
                                    ) => (

                                      <span
                                        key={
                                          skillIndex
                                        }
                                        style={{
                                          padding:
                                            "5px 9px",
                                          borderRadius:
                                            "6px",
                                          background:
                                            "#131d3c",
                                          color:
                                            "#aeb9d0",
                                          fontSize:
                                            "12px",
                                        }}
                                      >
                                        {skill}
                                      </span>

                                    )
                                  )}

                                </div>

                              </div>
                            )}


                            {/* =========================
                                DESCRIPTION
                            ========================= */}

                            <p className="job-description">

                              {description}

                            </p>


                            {/* =========================
                                FOOTER
                            ========================= */}

                            <div className="live-job-footer">

                              <span className="live-source">
                                🤖 AI Matched
                              </span>


                              <div
                                style={{
                                  display:
                                    "flex",
                                  gap: "8px",
                                  alignItems:
                                    "center",
                                }}
                              >

                                {/* DETAILS */}

                                {job.id && (
                                  <Link
                                    to={`/jobs/${job.id}`}
                                    className="apply-button"
                                    style={{
                                      textDecoration:
                                        "none",
                                      background:
                                        "#131d3c",
                                      border:
                                        "1px solid #26385d",
                                    }}
                                  >
                                    View Details →
                                  </Link>
                                )}


                                {/* APPLY */}

                                {applyLink ? (

                                  <button
                                    onClick={() =>
                                      handleApply(job)
                                    }
                                    className="apply-button"
                                  >
                                    Apply Now ↗
                                  </button>

                                ) : (

                                  <button
                                    className="apply-button"
                                    disabled
                                  >
                                    Apply Link Unavailable
                                  </button>

                                )}

                              </div>

                            </div>

                          </div>

                        );

                      }
                    )}

                  </div>

                </>

            )}

          </div>


          {/* =========================
              DATA SOURCE
          ========================= */}

          <div className="jobs-attribution">

            🤖 Jobs analyzed by CareerAI.
            External job listings will be connected
            through the configured job provider.

          </div>

        </section>

      </main>

    </div>
  );
}

export default Jobs;