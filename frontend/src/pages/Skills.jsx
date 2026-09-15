import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Skills.css";


function Skills() {

  const [skillData, setSkillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const fetchSkills = async () => {

      const token = localStorage.getItem("access_token");

      if (!token) {

        setError(
          "Please login to view your skill gap analysis."
        );

        setLoading(false);

        return;
      }


      try {

        const response = await fetch(
          "http://127.0.0.1:8000/api/skills/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        const data = await response.json();


        if (!response.ok) {

          setError(
            data.detail ||
            "Failed to load skill analysis."
          );

          return;
        }


        setSkillData(data);

      } catch (error) {

        console.error(
          "Skill analysis error:",
          error
        );

        setError(
          "Unable to connect to the server."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchSkills();

  }, []);


  return (

    <div className="skills-page">

      {/* =========================
          SHARED SIDEBAR
      ========================= */}

      <Sidebar />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="skills-main">

        <header className="skills-header">

          <div>

            <h1>
              Skill Gap Analysis
            </h1>

            <p>
              Identify your strengths and discover the skills
              you need to advance your career.
            </p>

          </div>

        </header>


        <section className="skills-section">

          <div className="section-badge">
            📊 SKILL ANALYSIS
          </div>


          <h2>
            Build Your <span>Career Skills</span>
          </h2>


          <p className="skills-description">
            Compare your current skills with the requirements
            of available job opportunities.
          </p>


          {/* =========================
              LOADING
          ========================= */}

          {loading && (

            <div className="skills-loading">

              <div className="skills-spinner"></div>

              <p>
                🤖 AI is analyzing your skills...
              </p>

            </div>

          )}


          {/* =========================
              ERROR
          ========================= */}

          {!loading && error && (

            <div className="skills-error">

              <div className="error-icon">
                ⚠️
              </div>

              <h3>
                {error}
              </h3>

              <Link
                to="/resume"
                className="resume-button"
              >
                Upload Resume →
              </Link>

            </div>

          )}


          {/* =========================
              DATA
          ========================= */}

          {!loading &&
          !error &&
          skillData && (

            <>


              {/* =========================
                  SUMMARY
              ========================= */}

              <div className="skills-summary">

                <div className="summary-card">

                  <div className="summary-icon">
                    🧠
                  </div>

                  <div>

                    <span>
                      Current Skills
                    </span>

                    <strong>
                      {skillData.total_resume_skills || 0}
                    </strong>

                  </div>

                </div>


                <div className="summary-card">

                  <div className="summary-icon">
                    🎯
                  </div>

                  <div>

                    <span>
                      Jobs Analyzed
                    </span>

                    <strong>
                      {skillData.jobs
                        ? skillData.jobs.length
                        : 0}
                    </strong>

                  </div>

                </div>


                <div className="summary-card">

                  <div className="summary-icon">
                    🚀
                  </div>

                  <div>

                    <span>
                      Skills to Learn
                    </span>

                    <strong>
                      {skillData.recommended_skills
                        ? skillData.recommended_skills.length
                        : 0}
                    </strong>

                  </div>

                </div>

              </div>


              {/* =========================
                  CURRENT SKILLS
              ========================= */}

              <div className="skills-card">

                <div className="card-heading">

                  <div>

                    <span className="card-label">
                      YOUR FOUNDATION
                    </span>

                    <h3>
                      🧠 Your Current Skills
                    </h3>

                    <p>
                      Skills detected from your latest resume.
                    </p>

                  </div>

                  <div className="card-heading-icon">
                    ✅
                  </div>

                </div>


                {skillData.resume_skills &&
                skillData.resume_skills.length > 0 ? (

                  <div className="skill-list current-skills">

                    {skillData.resume_skills.map(
                      (skill, index) => (

                        <span key={index}>
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <p className="no-skills">
                    No skills detected in your resume.
                  </p>

                )}

              </div>


              {/* =========================
                  AI RECOMMENDED SKILLS
              ========================= */}

              <div className="skills-card recommended-card">

                <div className="card-heading">

                  <div>

                    <span className="card-label">
                      AI CAREER DEVELOPMENT
                    </span>

                    <h3>
                      🤖 AI Recommended Skills
                    </h3>

                    <p>
                      Skills selected by AI based on your resume
                      and available job opportunities.
                    </p>

                  </div>

                  <div className="card-heading-icon">
                    🧠
                  </div>

                </div>


                {skillData.skill_analysis &&
                skillData.skill_analysis.length > 0 ? (

                  <div className="ai-skill-analysis">

                    {skillData.skill_analysis.map(
                      (item, index) => (

                        <div
                          className="ai-skill-card"
                          key={index}
                        >

                          <div className="ai-skill-header">

                            <div>

                              <h3>
                                {item.skill}
                              </h3>

                            </div>


                            <span
                              className={
                                `skill-priority ${(
                                  item.priority || ""
                                ).toLowerCase()}`
                              }
                            >
                              {item.priority}
                            </span>

                          </div>


                          <div className="ai-skill-section">

                            <h4>
                              💡 Why Learn This?
                            </h4>

                            <p>
                              {item.reason}
                            </p>

                          </div>


                          <div className="ai-skill-section">

                            <h4>
                              📚 Learning Path
                            </h4>

                            <p>
                              {item.learning_path}
                            </p>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) : skillData.recommended_skills &&
                  skillData.recommended_skills.length > 0 ? (

                  <div className="skill-list recommended-skills">

                    {skillData.recommended_skills.map(
                      (skill, index) => (

                        <span key={index}>
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <div className="all-skills-message">
                    🎉 Great job! Your skills already match
                    the available opportunities.
                  </div>

                )}

              </div>


              {/* =========================
                  JOB ANALYSIS
              ========================= */}

              <div className="job-analysis">

                <div className="card-heading">

                  <div>

                    <span className="card-label">
                      OPPORTUNITY ANALYSIS
                    </span>

                    <h3>
                      🎯 Job Skill Gap Analysis
                    </h3>

                    <p>
                      See which skills you have and which skills
                      you need for each role.
                    </p>

                  </div>

                  <div className="card-heading-icon">
                    💼
                  </div>

                </div>


                {skillData.jobs &&
                skillData.jobs.length > 0 ? (

                  <div className="job-skill-list">

                    {skillData.jobs.map((job) => (

                      <div
                        className="skill-job-card"
                        key={job.job_id}
                      >

                        <div className="skill-job-header">

                          <div>

                            <h3>
                              {job.job_title}
                            </h3>

                            <h4>
                              {job.company}
                            </h4>

                          </div>


                          <div className="job-match">

                            <span>
                              Match
                            </span>

                            <strong>
                              {job.match_score}%
                            </strong>

                          </div>

                        </div>


                        {/* MATCHED */}

                        <div className="skill-group">

                          <h4 className="matched-heading">
                            ✓ Skills You Have
                          </h4>


                          {job.matched_skills &&
                          job.matched_skills.length > 0 ? (

                            <div className="skill-list matched-list">

                              {job.matched_skills.map(
                                (skill, index) => (

                                  <span key={index}>
                                    {skill}
                                  </span>

                                )
                              )}

                            </div>

                          ) : (

                            <p className="no-skills">
                              No matching skills yet.
                            </p>

                          )}

                        </div>


                        {/* MISSING */}

                        <div className="skill-group">

                          <h4 className="missing-heading">
                            ⚠️ Skills You Need
                          </h4>


                          {job.missing_skills &&
                          job.missing_skills.length > 0 ? (

                            <div className="skill-list missing-list">

                              {job.missing_skills.map(
                                (skill, index) => (

                                  <span key={index}>
                                    {skill}
                                  </span>

                                )
                              )}

                            </div>

                          ) : (

                            <p className="all-matched">
                              🎉 You have all required skills!
                            </p>

                          )}

                        </div>


                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="no-jobs">

                    <div className="no-jobs-icon">
                      💼
                    </div>

                    <h3>
                      No job opportunities found
                    </h3>

                    <p>
                      Add some job opportunities to analyze
                      your skill gaps.
                    </p>

                  </div>

                )}

              </div>


            </>

          )}

        </section>

      </main>

    </div>

  );

}


export default Skills;