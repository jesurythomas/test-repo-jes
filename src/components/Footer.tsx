import { useState } from "react";

interface FooterProps {
  onSubscribe: (email: string) => Promise<void>;
}

export const Footer = ({ onSubscribe }: FooterProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setStatus("loading");
      await onSubscribe(email);
      setStatus("success");
      setMessage("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <p>&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#contact">Contact Us</a>
            </div>
          </div>

          <div className="newsletter">
            <h3>Subscribe to Our Newsletter</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === "loading"}
              />
              <button type="submit" disabled={status === "loading"} className="subscribe-button">
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {message && (
              <p className={`message ${status === "error" ? "error" : "success"}`}>{message}</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
