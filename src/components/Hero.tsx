import { useState } from "react";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onGetStarted();
  };

  return (
    <section id="home" className="hero">
      <div className="container">
        <h2>Welcome to Our Platform</h2>
        <p>The ultimate solution for your business needs. Simple. Powerful. Reliable.</p>
        <button className="cta-button" onClick={handleGetStarted} disabled={isLoading}>
          {isLoading ? "Loading..." : "Get Started"}
        </button>
      </div>
    </section>
  );
};
