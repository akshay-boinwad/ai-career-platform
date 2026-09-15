import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Profile.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const name = user.name || "CareerAI User";
  const email = user.email || "Email not available";

  return (
    <div className="profile-page">

      {/* =========================
          SHARED SIDEBAR
      ========================= */}

      <Sidebar />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="profile-main">

        <header className="profile-header">

          <div>
            <h1>My Profile</h1>

            <p>
              Manage your CareerAI profile and career information.
            </p>
          </div>

        </header>


        <section className="profile-section">

          {/* =========================
              PROFILE HERO
          ========================= */}

          <div className="profile-hero">

            <div className="profile-avatar">
              {name.charAt(0).toUpperCase()}
            </div>

            <div className="profile-hero-info">

              <span className="profile-label">
                CAREERAI PROFILE
              </span>

              <h2>
                {name}
              </h2>

              <p>
                {email}
              </p>

              <span className="profile-status">
                ● Active Account
              </span>

            </div>

          </div>


          {/* =========================
              PERSONAL INFORMATION
          ========================= */}

          <div className="profile-card">

            <div className="card-heading">

              <div>
                <span className="card-label">
                  ACCOUNT INFORMATION
                </span>

                <h3>
                  Personal Information
                </h3>

                <p>
                  Your basic account details.
                </p>
              </div>

              <div className="card-heading-icon">
                👤
              </div>

            </div>


            <div className="profile-grid">

              <div className="profile-field">

                <span>
                  Full Name
                </span>

                <strong>
                  {name}
                </strong>

              </div>


              <div className="profile-field">

                <span>
                  Email Address
                </span>

                <strong>
                  {email}
                </strong>

              </div>


              <div className="profile-field">

                <span>
                  Account Type
                </span>

                <strong>
                  CareerAI User
                </strong>

              </div>


              <div className="profile-field">

                <span>
                  Profile Status
                </span>

                <strong className="active-text">
                  Active
                </strong>

              </div>

            </div>

          </div>


          {/* =========================
              CAREER TOOLS
          ========================= */}

          <div className="profile-card">

            <div className="card-heading">

              <div>
                <span className="card-label">
                  CAREER TOOLS
                </span>

                <h3>
                  Your Career Journey
                </h3>

                <p>
                  Quickly access CareerAI features.
                </p>
              </div>

              <div className="card-heading-icon">
                🚀
              </div>

            </div>


            <div className="career-tools-grid">

              <Link
                to="/resume"
                className="career-tool"
              >

                <div className="tool-icon">
                  📄
                </div>

                <div>
                  <h4>
                    Resume Analysis
                  </h4>

                  <p>
                    Analyze and improve your resume.
                  </p>
                </div>

              </Link>


              <Link
                to="/jobs"
                className="career-tool"
              >

                <div className="tool-icon">
                  💼
                </div>

                <div>
                  <h4>
                    Job Recommendations
                  </h4>

                  <p>
                    Discover jobs that match your skills.
                  </p>
                </div>

              </Link>


              <Link
                to="/skills"
                className="career-tool"
              >

                <div className="tool-icon">
                  📊
                </div>

                <div>
                  <h4>
                    Skill Gap Analysis
                  </h4>

                  <p>
                    Find skills you should develop.
                  </p>
                </div>

              </Link>


              <Link
                to="/interview"
                className="career-tool"
              >

                <div className="tool-icon">
                  🎤
                </div>

                <div>
                  <h4>
                    Mock Interview
                  </h4>

                  <p>
                    Practice interview questions.
                  </p>
                </div>

              </Link>


              <Link
                to="/roadmap"
                className="career-tool"
              >

                <div className="tool-icon">
                  🗺️
                </div>

                <div>
                  <h4>
                    Career Roadmap
                  </h4>

                  <p>
                    Follow your personalized learning path.
                  </p>
                </div>

              </Link>


              <Link
                to="/applications"
                className="career-tool"
              >

                <div className="tool-icon">
                  📋
                </div>

                <div>
                  <h4>
                    Application Tracker
                  </h4>

                  <p>
                    Manage your job applications.
                  </p>
                </div>

              </Link>

            </div>

          </div>


          {/* =========================
              ACCOUNT ACTION
          ========================= */}

          <div className="profile-action-card">

            <div>

              <span className="card-label">
                ACCOUNT
              </span>

              <h3>
                Manage Your Account
              </h3>

              <p>
                Use the logout option when you want to end your
                current CareerAI session.
              </p>

            </div>


            <button
              className="logout-button"
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");

                window.location.href = "/login";
              }}
            >
              Logout
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;