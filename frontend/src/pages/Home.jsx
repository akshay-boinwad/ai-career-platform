import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          Career<span>AI</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
  <Link to="/login" className="login-link">
    Login
  </Link>

  <Link to="/register" className="get-started">
    Get Started
  </Link>
</div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-content">

          <div className="badge">
            ✨ AI-Powered Career Platform
          </div>

          <h1>
            Your Complete
            <br />
            <span>AI Career</span>
            <br />
            Companion
          </h1>

          <p className="hero-description">
            Analyze your resume, discover the right jobs, identify skill gaps,
            practice AI-powered mock interviews and become job-ready —
            all from one platform.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="primary-button">
              Analyze My Resume →
            </Link>

            <a href="#features" className="secondary-button">
              Explore Platform
            </a>
          </div>

          <div className="benefits">
            <div>
              <span>✓</span> Free to use
            </div>

            <div>
              <span>✓</span> AI-powered insights
            </div>

            <div>
              <span>✓</span> Personalized recommendations
            </div>
          </div>

        </div>

        {/* HERO VISUAL */}
        <div className="hero-visual">

          <div className="floating-card resume-card">
            <div className="card-icon blue-icon">📄</div>

            <div>
              <h3>Resume Analysis</h3>
              <p>ATS Score</p>

              <div className="score">
                85%
              </div>
            </div>
          </div>

          <div className="floating-card career-card">
            <div className="card-icon purple-icon">💼</div>

            <div>
              <h3>Career Recommendations</h3>
              <p>Software Developer</p>
              <p>Data Analyst</p>
              <p>AI/ML Engineer</p>
            </div>
          </div>

          <div className="ai-person">
            <div className="person-head">
              🧑‍💻
            </div>

            <div className="laptop">
              <span>Career<span>AI</span></span>
            </div>
          </div>

          <div className="floating-card skill-card">
            <div className="card-icon green-icon">📊</div>

            <div>
              <h3>Skill Gap Analysis</h3>
              <p>3 Skills to Improve →</p>
            </div>
          </div>

          <div className="floating-card interview-card">
            <div className="card-icon orange-icon">🎤</div>

            <div>
              <h3>Mock Interview</h3>
              <p>Practice with AI →</p>
            </div>
          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">

        <div className="feature">

          <div className="feature-icon blue-feature">
            📄
          </div>

          <div>
            <h3>Smart Resume Analysis</h3>
            <p>
              Get instant AI feedback on your resume
            </p>
          </div>

        </div>

        <div className="feature">

          <div className="feature-icon green-feature">
            🎯
          </div>

          <div>
            <h3>Personalized Job Matches</h3>
            <p>
              Find the right opportunities for your skills
            </p>
          </div>

        </div>

        <div className="feature">

          <div className="feature-icon purple-feature">
            📊
          </div>

          <div>
            <h3>Skill Gap Insights</h3>
            <p>
              Identify and improve missing skills
            </p>
          </div>

        </div>

        <div className="feature">

          <div className="feature-icon orange-feature">
            🎤
          </div>

          <div>
            <h3>AI Mock Interviews</h3>
            <p>
              Practice and build confidence
            </p>
          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">

        <div className="section-badge">
          SIMPLE & POWERFUL
        </div>

        <h2>
          How <span>CareerAI</span> Works
        </h2>

        <p className="section-description">
          Get job-ready in just a few simple steps.
        </p>

        <div className="steps">

          <div className="step">
            <div className="step-number">01</div>
            <h3>Create Your Profile</h3>
            <p>
              Tell CareerAI about your skills, education and career goals.
            </p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <h3>Analyze Your Skills</h3>
            <p>
              Upload your resume and receive intelligent AI-powered insights.
            </p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <h3>Build Your Career</h3>
            <p>
              Discover jobs, improve skills and practice interviews.
            </p>
          </div>

        </div>

      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">

        <h2>
          Build a <span>Better Career</span>
        </h2>

        <p>
          CareerAI brings everything you need for your career journey
          into one intelligent platform.
        </p>

        <Link to="/register" className="primary-button">
          Start Your Journey →
        </Link>

      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          Career<span>AI</span>
        </div>

        <p>
          AI-powered career guidance for the modern professional.
        </p>

        <p className="copyright">
          © 2026 CareerAI. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default Home;