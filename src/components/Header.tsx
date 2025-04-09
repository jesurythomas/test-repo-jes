import { useState } from "react";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header = ({ isLoggedIn, onLogin, onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">Company Name</h1>
        <nav className="nav">
          <button className="mobile-menu" onClick={toggleMenu}>
            Menu
          </button>
          <ul className={isMenuOpen ? "active" : ""}>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#game">Game</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <button className="nav-button" onClick={isLoggedIn ? onLogout : onLogin}>
                {isLoggedIn ? "Logout" : "Login"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
