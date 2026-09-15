import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Interview.css";

function Interview() {
  const [role, setRole] = useState("Software Developer");
  const [difficulty, setDifficulty] = useState("Medium");

  const [interviews, setInterviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // START INTERVIEW
  // ==========================================

  const startInterview = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Please login again to start the interview.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setAnswer("");
    setAnswers([]);
    setCurrentIndex(0);

    try {
      const params = new URLSearchParams({
        role,
        difficulty,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/interview/start?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail || "Failed to start interview."
        );
        return;
      }

      setInterviews(data.interviews || []);
    } catch (error) {
      console.error("Interview error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUBMIT ANSWER
  // ==========================================

  const submitAnswer = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Please login again.");
      return;
    }

    if (!answer.trim()) {
      setError(
        "Please enter your answer before submitting."
      );
      return;
    }

    const currentInterview =
      interviews[currentIndex];

    if (!currentInterview) {
      setError("Interview question not found.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const params = new URLSearchParams({
        answer,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/interview/${currentInterview.id}/answer?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            "Failed to evaluate answer."
        );
        return;
      }

      // ========================================
      // SAVE AI EVALUATION
      // ========================================

      const newAnswer = {
        question: data.result.question,
        answer: data.result.answer,
        score: data.result.score,
        feedback: data.result.feedback,

        // Detailed AI scores
        technical_score:
          data.result.technical_score ?? 0,

        communication_score:
          data.result.communication_score ?? 0,

        problem_solving_score:
          data.result.problem_solving_score ?? 0,

        // AI feedback
        strengths:
          data.result.strengths || [],

        improvements:
          data.result.improvements || [],

        better_answer:
          data.result.better_answer || "",
      };

      const updatedAnswers = [
        ...answers,
        newAnswer,
      ];

      setAnswers(updatedAnswers);

      // ========================================
      // INTERVIEW COMPLETE
      // ========================================

      if (
        currentIndex ===
        interviews.length - 1
      ) {
        const totalScore =
          updatedAnswers.reduce(
            (total, item) =>
              total + item.score,
            0
          );

        const averageScore =
          Math.round(
            totalScore /
              updatedAnswers.length
          );

        // Calculate detailed averages
        const totalTechnical =
          updatedAnswers.reduce(
            (total, item) =>
              total +
              item.technical_score,
            0
          );

        const totalCommunication =
          updatedAnswers.reduce(
            (total, item) =>
              total +
              item.communication_score,
            0
          );

        const totalProblemSolving =
          updatedAnswers.reduce(
            (total, item) =>
              total +
              item.problem_solving_score,
            0
          );

        const averageTechnical =
          Math.round(
            totalTechnical /
              updatedAnswers.length
          );

        const averageCommunication =
          Math.round(
            totalCommunication /
              updatedAnswers.length
          );

        const averageProblemSolving =
          Math.round(
            totalProblemSolving /
              updatedAnswers.length
          );

        setResult({
          score: averageScore,

          technical_score:
            averageTechnical,

          communication_score:
            averageCommunication,

          problem_solving_score:
            averageProblemSolving,

          answers: updatedAnswers,
        });

        setInterviews([]);
        setAnswer("");
      } else {
        // ======================================
        // NEXT QUESTION
        // ======================================

        setCurrentIndex(
          currentIndex + 1
        );

        setAnswer("");
      }
    } catch (error) {
      console.error(
        "Answer error:",
        error
      );

      setError(
        "Unable to evaluate your answer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // START NEW INTERVIEW
  // ==========================================

  const startNewInterview = () => {
    setInterviews([]);
    setCurrentIndex(0);
    setAnswer("");
    setAnswers([]);
    setResult(null);
    setError("");
  };

  const currentInterview =
    interviews[currentIndex];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="interview-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar />

      {/* =========================
          MAIN
      ========================= */}

      <main className="interview-main">

        {/* HEADER */}

        <header className="interview-header">
          <div>
            <h1>Mock Interview</h1>

            <p>
              Practice interview questions and
              improve your interview performance
              with AI-powered feedback.
            </p>
          </div>
        </header>

        <section className="interview-section">

          {/* BADGE */}

          <div className="section-badge">
            🎤 AI INTERVIEW PRACTICE
          </div>

          <h2>
            Prepare for Your{" "}
            <span>Next Interview</span>
          </h2>

          <p className="interview-description">
            Practice five personalized interview
            questions and receive AI-powered
            evaluation for every answer.
          </p>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <div className="interview-error">
              ⚠️ {error}
            </div>
          )}

          {/* =========================
              START SCREEN
          ========================= */}

          {!currentInterview &&
            !result && (
              <div className="interview-start-card">

                <div className="start-icon">
                  🤖
                </div>

                <h3>
                  Start AI Mock Interview
                </h3>

                <p>
                  Gemini will generate
                  personalized questions based
                  on your resume, target role,
                  and difficulty.
                </p>

                <div className="interview-form">

                  {/* ROLE */}

                  <div className="form-group">

                    <label>
                      Target Role
                    </label>

                    <select
                      value={role}
                      onChange={(e) =>
                        setRole(
                          e.target.value
                        )
                      }
                    >
                      <option value="Software Developer">
                        Software Developer
                      </option>

                      <option value="Frontend Developer">
                        Frontend Developer
                      </option>

                      <option value="Backend Developer">
                        Backend Developer
                      </option>

                      <option value="Full Stack Developer">
                        Full Stack Developer
                      </option>

                      <option value="Data Analyst">
                        Data Analyst
                      </option>

                      <option value="Data Scientist">
                        Data Scientist
                      </option>

                      <option value="Machine Learning Engineer">
                        Machine Learning Engineer
                      </option>
                    </select>

                  </div>

                  {/* DIFFICULTY */}

                  <div className="form-group">

                    <label>
                      Difficulty
                    </label>

                    <select
                      value={difficulty}
                      onChange={(e) =>
                        setDifficulty(
                          e.target.value
                        )
                      }
                    >
                      <option value="Easy">
                        Easy
                      </option>

                      <option value="Medium">
                        Medium
                      </option>

                      <option value="Hard">
                        Hard
                      </option>
                    </select>

                  </div>

                </div>

                <button
                  className="start-button"
                  onClick={startInterview}
                  disabled={loading}
                >
                  {loading
                    ? "🤖 Generating AI Questions..."
                    : "Start AI Interview →"}
                </button>

              </div>
            )}

          {/* =========================
              QUESTION
          ========================= */}

          {currentInterview &&
            !result && (
              <div className="question-card">

                {/* PROGRESS */}

                <div className="question-progress">

                  <div className="progress-info">

                    <span>
                      Question{" "}
                      {currentIndex + 1} of{" "}
                      {interviews.length}
                    </span>

                    <span>
                      {Math.round(
                        ((currentIndex + 1) /
                          interviews.length) *
                          100
                      )}
                      %
                    </span>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          ((currentIndex + 1) /
                            interviews.length) *
                          100
                        }%`,
                      }}
                    />

                  </div>

                </div>

                {/* QUESTION HEADER */}

                <div className="question-top">

                  <div>

                    <span className="question-label">
                      🤖 AI INTERVIEW QUESTION
                    </span>

                    <h3>
                      {role}
                    </h3>

                  </div>

                  <span className="difficulty-badge">
                    {difficulty}
                  </span>

                </div>

                {/* QUESTION */}

                <div className="question-box">

                  <span>
                    Question{" "}
                    {currentIndex + 1}
                  </span>

                  <h2>
                    {currentInterview.question}
                  </h2>

                </div>

                {/* ANSWER */}

                <div className="answer-section">

                  <label>
                    Your Answer
                  </label>

                  <textarea
                    value={answer}
                    onChange={(e) =>
                      setAnswer(
                        e.target.value
                      )
                    }
                    placeholder="Explain your answer clearly. Include examples from your projects or experience when relevant..."
                    rows="8"
                  />

                  <div className="answer-info">

                    <span>
                      {answer.trim()
                        ? answer
                            .trim()
                            .split(/\s+/)
                            .length
                        : 0}{" "}
                      words
                    </span>

                    <span>
                      💡 Give a detailed answer
                      with examples.
                    </span>

                  </div>

                </div>

                {/* SUBMIT */}

                <button
                  className="submit-answer-button"
                  onClick={submitAnswer}
                  disabled={submitting}
                >
                  {submitting
                    ? "🤖 AI Evaluating..."
                    : currentIndex ===
                      interviews.length - 1
                    ? "Finish Interview →"
                    : "Submit & Next →"}
                </button>

              </div>
            )}

          {/* =========================
              FINAL RESULTS
          ========================= */}

          {result && (
            <div className="result-card">

              <div className="result-icon">
                🧠
              </div>

              <span className="result-label">
                AI INTERVIEW COMPLETE
              </span>

              <h2>
                Your Interview Performance
              </h2>

              {/* =====================
                  OVERALL SCORE
              ===================== */}

              <div className="score-circle">

                <strong>
                  {result.score}
                </strong>

                <span>
                  / 100
                </span>

              </div>

              <p className="result-summary">
                You completed all five
                AI-generated interview
                questions.
              </p>

              {/* =====================
                  OVERALL AI SCORE CARDS
              ===================== */}

              <div className="detailed-ai-scores">

                {/* TECHNICAL */}

                <div className="ai-score-card technical-score-card">

                  <div className="ai-score-icon">
                    🧠
                  </div>

                  <div className="ai-score-content">

                    <span>
                      Technical
                    </span>

                    <strong>
                      {result.technical_score}/100
                    </strong>

                  </div>

                </div>

                {/* COMMUNICATION */}

                <div className="ai-score-card communication-score-card">

                  <div className="ai-score-icon">
                    💬
                  </div>

                  <div className="ai-score-content">

                    <span>
                      Communication
                    </span>

                    <strong>
                      {result.communication_score}/100
                    </strong>

                  </div>

                </div>

                {/* PROBLEM SOLVING */}

                <div className="ai-score-card problem-solving-score-card">

                  <div className="ai-score-icon">
                    🧩
                  </div>

                  <div className="ai-score-content">

                    <span>
                      Problem Solving
                    </span>

                    <strong>
                      {result.problem_solving_score}/100
                    </strong>

                  </div>

                </div>

              </div>

              {/* =====================
                  QUESTION RESULTS
              ===================== */}

              <div className="answer-results">

                {result.answers.map(
                  (item, index) => (

                    <div
                      className="answer-result-card"
                      key={index}
                    >

                      {/* RESULT HEADER */}

                      <div className="answer-result-header">

                        <span>
                          Question{" "}
                          {index + 1}
                        </span>

                        <strong>
                          {item.score}/100
                        </strong>

                      </div>

                      {/* QUESTION */}

                      <h3>
                        {item.question}
                      </h3>

                      {/* USER ANSWER */}

                      <div className="user-answer-box">

                        <h4>
                          📝 Your Answer
                        </h4>

                        <p>
                          {item.answer}
                        </p>

                      </div>

                      {/* FEEDBACK */}

                      <div className="feedback-box">

                        <h4>
                          💡 AI Feedback
                        </h4>

                        <p>
                          {item.feedback}
                        </p>

                      </div>

                      {/* =====================
                          QUESTION-LEVEL SCORES
                      ===================== */}

                      <div className="detailed-ai-scores">

                        {/* TECHNICAL */}

                        <div className="ai-score-card technical-score-card">

                          <div className="ai-score-icon">
                            🧠
                          </div>

                          <div className="ai-score-content">

                            <span>
                              Technical
                            </span>

                            <strong>
                              {item.technical_score}/100
                            </strong>

                          </div>

                        </div>

                        {/* COMMUNICATION */}

                        <div className="ai-score-card communication-score-card">

                          <div className="ai-score-icon">
                            💬
                          </div>

                          <div className="ai-score-content">

                            <span>
                              Communication
                            </span>

                            <strong>
                              {item.communication_score}/100
                            </strong>

                          </div>

                        </div>

                        {/* PROBLEM SOLVING */}

                        <div className="ai-score-card problem-solving-score-card">

                          <div className="ai-score-icon">
                            🧩
                          </div>

                          <div className="ai-score-content">

                            <span>
                              Problem Solving
                            </span>

                            <strong>
                              {item.problem_solving_score}/100
                            </strong>

                          </div>

                        </div>

                      </div>

                      {/* =====================
                          STRENGTHS
                      ===================== */}

                      {item.strengths &&
                        item.strengths.length >
                          0 && (
                          <div className="ai-result-section strengths-section">

                            <h4>
                              💪 Strengths
                            </h4>

                            <ul>
                              {item.strengths.map(
                                (
                                  strength,
                                  strengthIndex
                                ) => (
                                  <li
                                    key={
                                      strengthIndex
                                    }
                                  >
                                    {strength}
                                  </li>
                                )
                              )}
                            </ul>

                          </div>
                        )}

                      {/* =====================
                          IMPROVEMENTS
                      ===================== */}

                      {item.improvements &&
                        item.improvements.length >
                          0 && (
                          <div className="ai-result-section improvements-section">

                            <h4>
                              🎯 Areas to Improve
                            </h4>

                            <ul>
                              {item.improvements.map(
                                (
                                  improvement,
                                  improvementIndex
                                ) => (
                                  <li
                                    key={
                                      improvementIndex
                                    }
                                  >
                                    {improvement}
                                  </li>
                                )
                              )}
                            </ul>

                          </div>
                        )}

                      {/* =====================
                          BETTER ANSWER
                      ===================== */}

                      {item.better_answer && (
                        <div className="better-answer-box">

                          <h4>
                            ✨ Example of a Better Answer
                          </h4>

                          <p>
                            {item.better_answer}
                          </p>

                        </div>
                      )}

                    </div>
                  )
                )}

              </div>

              {/* NEW INTERVIEW */}

              <button
                className="new-interview-button"
                onClick={startNewInterview}
              >
                Start New AI Interview →
              </button>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default Interview;