import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./CareerAssistant.css";

function CareerAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = message.trim();

    if (!text) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const params = new URLSearchParams({
        message: text,
      });

      const response = await fetch(
        `http://localhost:8000/api/career-assistant/chat?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            text:
              data.detail ||
              "Sorry, I couldn't process your request.",
          },
        ]);

        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error("Career Assistant error:", error);

      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          text: "Unable to connect to CareerAI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "What skills should I learn?",
    "How can I improve my resume?",
    "Which jobs are best for me?",
    "How should I prepare for interviews?",
  ];

  const useQuickQuestion = (question) => {
    setMessage(question);
  };

  return (
    <div className="career-assistant-page">

      <Sidebar />

      <main className="career-assistant-main">

        <header className="career-assistant-header">
          <div>
            <h1>AI Career Assistant</h1>
            <p>
              Ask CareerAI about your resume, skills, jobs,
              interviews, and career roadmap.
            </p>
          </div>
        </header>


        <section className="assistant-section">

          <div className="assistant-hero">

            <span className="assistant-badge">
              🤖 AI CAREER GUIDANCE
            </span>

            <h2>
              Your Personal <span>Career Assistant</span>
            </h2>

            <p>
              Get personalized career guidance from one place.
              Ask questions about your career and CareerAI will
              help you find your next step.
            </p>

          </div>


          {messages.length === 0 && (

            <div className="quick-questions">

              <div className="quick-heading">
                <span>TRY ASKING</span>
                <h3>How can I help you?</h3>
              </div>

              <div className="quick-grid">

                {quickQuestions.map((question) => (

                  <button
                    key={question}
                    className="quick-question"
                    onClick={() =>
                      useQuickQuestion(question)
                    }
                  >
                    <span>💡</span>
                    {question}
                  </button>

                ))}

              </div>

            </div>

          )}


          <div className="chat-card">

            <div className="chat-header">

              <div className="chat-avatar">
                🤖
              </div>

              <div>
                <h3>CareerAI Assistant</h3>
                <span>
                  Career guidance assistant
                </span>
              </div>

            </div>


            <div className="chat-messages">

              {messages.length === 0 && (

                <div className="welcome-message">

                  <div className="welcome-chat-icon">
                    🤖
                  </div>

                  <h3>
                    Hello! I'm your CareerAI Assistant.
                  </h3>

                  <p>
                    Ask me anything about your resume,
                    skills, jobs, interviews, or career plan.
                  </p>

                </div>

              )}


              {messages.map((item, index) => (

                <div
                  key={index}
                  className={`chat-message ${
                    item.type === "user"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                >

                  <div className="message-avatar">
                    {item.type === "user"
                      ? "👤"
                      : "🤖"}
                  </div>

                  <div className="message-content">
                    {item.text}
                  </div>

                </div>

              ))}


              {loading && (

                <div className="chat-message assistant-message">

                  <div className="message-avatar">
                    🤖
                  </div>

                  <div className="message-content typing">
                    CareerAI is thinking...
                  </div>

                </div>

              )}

            </div>


            <div className="chat-input-area">

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask CareerAI a career question..."
                rows="2"
              />

              <button
                onClick={sendMessage}
                disabled={
                  loading || !message.trim()
                }
              >
                {loading ? "Sending..." : "Send →"}
              </button>

            </div>

            <div className="chat-hint">
              Press Enter to send • Shift + Enter for a new line
            </div>

          </div>


          <div className="assistant-links">

            <Link to="/resume">
              📄 Resume Analysis
            </Link>

            <Link to="/jobs">
              💼 Job Recommendations
            </Link>

            <Link to="/skills">
              📊 Skill Gap Analysis
            </Link>

            <Link to="/interview">
              🎤 Mock Interview
            </Link>

            <Link to="/roadmap">
              🗺️ Career Roadmap
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CareerAssistant;