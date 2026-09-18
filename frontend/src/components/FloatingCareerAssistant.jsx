import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FloatingCareerAssistant.css";

function FloatingCareerAssistant() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! 👋 I'm your CareerAI Assistant. How can I help you with your career today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Please log in to use the AI Career Assistant.",
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: trimmedMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/career-assistant/chat?message=${encodeURIComponent(
          trimmedMessage
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to get AI response."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            data.response ||
            "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("Career Assistant Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const openFullAssistant = () => {
    navigate("/career-assistant");
  };

  return (
    <>
      {isOpen && (
        <div className="career-chat-popup">

          <div className="career-chat-header">
            <div className="career-chat-title">
              <div className="career-chat-avatar">
                🤖
              </div>

              <div>
                <h3>CareerAI Assistant</h3>
                <span>
                  ● Online
                </span>
              </div>
            </div>

            <button
              className="career-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              ✕
            </button>
          </div>

          <div className="career-chat-messages">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`career-chat-message ${
                  item.sender === "user"
                    ? "user-message"
                    : "ai-message"
                }`}
              >
                {item.text}
              </div>
            ))}

            {loading && (
              <div className="career-chat-message ai-message">
                <span className="typing-dots">
                  Thinking...
                </span>
              </div>
            )}

          </div>

          <div className="career-chat-input-area">

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your career..."
              rows="1"
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={
                loading || !message.trim()
              }
              aria-label="Send message"
            >
              ➤
            </button>

          </div>

          <button
            className="career-chat-full-button"
            onClick={openFullAssistant}
          >
            Open Full Career Assistant →
          </button>

        </div>
      )}

      <button
        className={`floating-career-assistant ${
          isOpen ? "assistant-open" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        title="AI Career Assistant"
        aria-label="Open AI Career Assistant"
      >
        <span className="assistant-icon">
          {isOpen ? "✕" : "🤖"}
        </span>
      </button>
    </>
  );
}

export default FloatingCareerAssistant;