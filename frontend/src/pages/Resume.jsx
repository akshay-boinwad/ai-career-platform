import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Resume.css";

function Resume() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeHistory, setResumeHistory] = useState([]);

  // =========================
  // FETCH RESUME HISTORY
  // =========================

  useEffect(() => {
    const fetchResumeHistory = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/resume/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch resume history.");
          return;
        }

        const data = await response.json();

        setResumeHistory(data.resumes || []);
      } catch (error) {
        console.error("Resume history error:", error);
      }
    };

    fetchResumeHistory();
  }, []);


  // =========================
  // SELECT RESUME
  // =========================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setAnalysis(null);
    }
  };


  // =========================
  // DRAG AND DROP
  // =========================

  const handleDrop = (e) => {
    e.preventDefault();

    setDragging(false);

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) {
      setFile(droppedFile);
      setAnalysis(null);
    }
  };


  // =========================
  // UPLOAD AND ANALYZE
  // =========================

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();

    formData.append("file", file);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resume/upload`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Resume analysis failed.");
        return;
      }

      console.log(
        "Resume analysis response:",
        data
      );

      setAnalysis(data.analysis);

    } catch (error) {
      console.error("Upload error:", error);

      alert(
        "Cannot connect to the CareerAI server."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="resume-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="resume-main">

        {/* HEADER */}

        <header className="resume-header">

          <div>

            <h1>
              Resume Analysis
            </h1>

            <p>
              Upload your resume and get intelligent insights
              to improve your chances of getting hired.
            </p>

          </div>

        </header>


        {/* =====================================================
            UPLOAD SECTION
        ===================================================== */}

        <section className="resume-upload-section">

          <div className="section-badge">
            ✨ AI-POWERED ANALYSIS
          </div>


          <h2>
            Analyze Your <span>Resume</span>
          </h2>


          <p className="upload-description">
            Upload your resume in PDF or DOCX format.
            CareerAI will analyze your resume and provide
            personalized career recommendations.
          </p>


          {/* UPLOAD BOX */}

          <div
            className={`upload-box ${
              dragging ? "dragging" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() =>
              setDragging(false)
            }
            onDrop={handleDrop}
          >

            <div className="upload-icon">
              📄
            </div>


            <h3>
              {file
                ? file.name
                : "Drop your resume here"}
            </h3>


            <p>
              {file
                ? `${(
                    file.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB`
                : "or click below to browse your files"}
            </p>


            <label className="browse-button">

              Choose Resume

              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                hidden
              />

            </label>


            <span className="file-info">
              Supported formats: PDF, DOCX • Maximum size: 5MB
            </span>

          </div>


          {/* ANALYZE BUTTON */}

          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={!file || loading}
          >
            {loading
              ? "🤖 Analyzing Resume..."
              : "🤖 Analyze Resume →"}
          </button>

        </section>


        {/* =====================================================
            ANALYSIS RESULTS
        ===================================================== */}

        {analysis && (

          <section className="results-section">

            {/* RESULTS HEADER */}

            <div className="results-header">

              <div>

                <span className="section-badge">
                  ✨ ANALYSIS COMPLETE
                </span>


                <h2>
                  Your Resume <span>Results</span>
                </h2>


                <p>
                  Here is what CareerAI found in your resume.
                </p>

              </div>


              {/* ATS SCORE */}

              <div className="ats-score">

                <span>
                  ATS Score
                </span>

                <strong>
                  {analysis.ats_score}%
                </strong>

              </div>

            </div>


            {/* DETECTED SKILLS */}

            <div className="result-card">

              <h3>
                🧠 Detected Skills
              </h3>


              <div className="skill-list">

                {analysis.skills &&
                analysis.skills.length > 0 ? (

                  analysis.skills.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="skill-tag"
                      >
                        {skill}
                      </span>

                    )
                  )

                ) : (

                  <p>
                    No technical skills detected.
                  </p>

                )}

              </div>

            </div>


            {/* STRENGTHS + WEAKNESSES */}

            <div className="results-grid">

              {/* STRENGTHS */}

              <div className="result-card">

                <h3>
                  💪 Strengths
                </h3>


                <ul>

                  {analysis.strengths &&
                  analysis.strengths.length > 0 ? (

                    analysis.strengths.map(
                      (item, index) => (

                        <li key={index}>
                          {item}
                        </li>

                      )
                    )

                  ) : (

                    <li>
                      No major strengths detected.
                    </li>

                  )}

                </ul>

              </div>


              {/* WEAKNESSES */}

              <div className="result-card">

                <h3>
                  ⚠️ Weaknesses
                </h3>


                <ul>

                  {analysis.weaknesses &&
                  analysis.weaknesses.length > 0 ? (

                    analysis.weaknesses.map(
                      (item, index) => (

                        <li key={index}>
                          {item}
                        </li>

                      )
                    )

                  ) : (

                    <li>
                      No major weaknesses detected.
                    </li>

                  )}

                </ul>

              </div>

            </div>


            {/* MISSING SKILLS */}

            <div className="result-card">

              <h3>
                📚 Skills You Should Improve
              </h3>


              <div className="skill-list">

                {analysis.missing_skills &&
                analysis.missing_skills.length > 0 ? (

                  analysis.missing_skills.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="missing-tag"
                      >
                        {skill}
                      </span>

                    )
                  )

                ) : (

                  <p>
                    No major skill gaps detected.
                  </p>

                )}

              </div>

            </div>


            {/* SUGGESTIONS */}

            <div className="result-card">

              <h3>
                💡 Improvement Suggestions
              </h3>


              <ul>

                {analysis.suggestions &&
                analysis.suggestions.map(
                  (item, index) => (

                    <li key={index}>
                      {item}
                    </li>

                  )
                )}

              </ul>

            </div>


            {/* RECOMMENDED ROLES */}

            <div className="result-card">

              <h3>
                💼 Recommended Career Roles
              </h3>


              <div className="role-list">

                {analysis.recommended_roles &&
                analysis.recommended_roles.map(
                  (role, index) => (

                    <div
                      key={index}
                      className="role-card"
                    >

                      <span>
                        💼
                      </span>

                      {role}

                    </div>

                  )
                )}

              </div>

            </div>

          </section>

        )}


        {/* =====================================================
            RESUME HISTORY
        ===================================================== */}

        {resumeHistory.length > 0 && (

          <section className="history-section">

            <div className="preview-heading">

              <div>

                <h2>
                  Resume <span>History</span>
                </h2>

                <p>
                  Your previously analyzed resumes.
                </p>

              </div>

            </div>


            <div className="history-list">

              {resumeHistory.map(
                (resume) => (

                  <div
                    className="history-card"
                    key={resume.id}
                  >

                    <div>

                      <h3>
                        📄 {resume.filename}
                      </h3>


                      <p>
                        Analyzed:{" "}
                        {new Date(
                          resume.created_at
                        ).toLocaleDateString()}
                      </p>

                    </div>


                    <div className="history-score">

                      <span>
                        ATS Score
                      </span>

                      <strong>
                        {resume.ats_score}%
                      </strong>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* =====================================================
            WHAT YOU'LL GET
        ===================================================== */}

        {!analysis && (

          <section className="analysis-preview">

            <div className="preview-heading">

              <div>

                <h2>
                  What You'll Get
                </h2>


                <p>
                  CareerAI analyzes multiple aspects of your resume.
                </p>

              </div>

            </div>


            <div className="analysis-grid">

              {/* ATS */}

              <div className="analysis-card">

                <div className="analysis-icon blue">
                  🎯
                </div>


                <h3>
                  ATS Score
                </h3>


                <p>
                  Understand how well your resume performs
                  with Applicant Tracking Systems.
                </p>

              </div>


              {/* STRENGTHS */}

              <div className="analysis-card">

                <div className="analysis-icon green">
                  💪
                </div>


                <h3>
                  Resume Strengths
                </h3>


                <p>
                  Discover the strongest parts of your resume
                  and what makes you stand out.
                </p>

              </div>


              {/* SKILL GAP */}

              <div className="analysis-card">

                <div className="analysis-icon purple">
                  📊
                </div>


                <h3>
                  Skill Gap
                </h3>


                <p>
                  Identify important skills you are missing
                  for your target career.
                </p>

              </div>


              {/* JOBS */}

              <div className="analysis-card">

                <div className="analysis-icon orange">
                  💼
                </div>


                <h3>
                  Job Recommendations
                </h3>


                <p>
                  Get career roles and job opportunities that
                  match your profile.
                </p>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default Resume;