import { useState } from "react";

interface Feature {
  id: number;
  title: string;
  description: string;
  likes: number;
}

export const Features = () => {
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 1,
      title: "Easy to Use",
      description: "Intuitive interface designed for best user experience.",
      likes: 0,
    },
    {
      id: 2,
      title: "Powerful Tools",
      description: "Advanced capabilities to handle complex tasks.",
      likes: 0,
    },
    {
      id: 3,
      title: "Secure",
      description: "Your data is safe with our enterprise-grade security.",
      likes: 0,
    },
  ]);

  const handleLike = async (id: number) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === id ? { ...feature, likes: feature.likes + 1 } : feature
      )
    );
  };

  return (
    <section id="features" className="features">
      <div className="container">
        <h2>Our Features</h2>
        <div className="feature-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button className="like-button" onClick={() => handleLike(feature.id)}>
                👍 {feature.likes} Likes
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
