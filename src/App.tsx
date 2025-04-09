import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { SnakeGame } from "./components/SnakeGame";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulated authentication actions
  const handleLogin = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoggedIn(true);
    alert("Successfully logged in!");
  };

  const handleLogout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoggedIn(false);
    alert("Successfully logged out!");
  };

  // Simulated get started action
  const handleGetStarted = async () => {
    if (!isLoggedIn) {
      const shouldLogin = window.confirm("You need to login first. Would you like to login?");
      if (shouldLogin) {
        await handleLogin();
      }
      return;
    }
    alert("Welcome to your dashboard!");
  };

  // Simulated newsletter subscription
  const handleSubscribe = async (email: string) => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes("@")) {
          resolve(true);
        } else {
          reject(new Error("Invalid email"));
        }
      }, 1500);
    });
  };

  return (
    <div className="landing-page">
      <Header isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
      <Hero onGetStarted={handleGetStarted} />
      <section className="game-section">
        <div className="container">
          <h2>Try Our Snake Game!</h2>
          <SnakeGame />
        </div>
      </section>
      <Features />
      <Footer onSubscribe={handleSubscribe} />
    </div>
  );
}

export default App;
