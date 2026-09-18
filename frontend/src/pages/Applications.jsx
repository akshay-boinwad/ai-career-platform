import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Applications.css";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch applications.");
          return;
        }

        const data = await response.json();

        setApplications(data.applications || []);
      } catch (error) {
        console.error("Applications error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="applications-page">

      {/* =========================
          SHARED SIDEBAR
      ========================= */}

      <Sidebar />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="applications-main">

        <header className="applications-header">

          <div>
            <h1>
              Application Tracker
            </h1>

            <p>
              Track and manage all your job applications in one place.
            </p>
          </div>

        </header>


        <section className="applications-section">

          <div className="section-badge">
            📋 APPLICATION TRACKER
          </div>


          <h2>
            Your <span>Job Applications</span>
          </h2>


          <p className="applications-description">
            Keep track of the jobs you have applied for and monitor
            your application progress.
          </p>


          {/* =========================
              LOADING
          ========================= */}

          {loading ? (

            <div className="applications-loading">
              🔄 Loading your applications...
            </div>

          ) : applications.length === 0 ? (

            /* =========================
               EMPTY STATE
            ========================= */

            <div className="applications-empty">

              <div className="empty-icon">
                📋
              </div>

              <h3>
                No applications yet
              </h3>

              <p>
                Start applying to jobs and your applications will
                appear here.
              </p>

              <Link
                to="/jobs"
                className="browse-jobs-button"
              >
                Browse Jobs →
              </Link>

            </div>

          ) : (

            /* =========================
               APPLICATION LIST
            ========================= */

            <div className="applications-list">

              {applications.map((application) => (

                <div
                  className="application-card"
                  key={application.id}
                >

                  <div className="application-icon">
                    💼
                  </div>


                  <div className="application-info">

                    <h3>
                      {application.job_title}
                    </h3>

                    <h4>
                      {application.company}
                    </h4>

                    <p>
                      📍{" "}
                      {application.location ||
                        "Location not specified"}
                    </p>

                  </div>


                  <div className="application-status">

                    <span className="status-label">
                      Status
                    </span>

                    <span className="status-badge">
                      {application.status}
                    </span>

                  </div>


                  <div className="application-date">

                    <span>
                      Applied On
                    </span>

                    <strong>
                      {application.applied_at
                        ? new Date(
                            application.applied_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </strong>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Applications;