import { useState } from "react";

interface HeaderProps {
  onLogin: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
}

export const Header = ({ onLogin, onLogout, isLoggedIn }: HeaderProps) => {
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
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              {isLoggedIn ? (
                <button className="nav-button" onClick={onLogout}>
                  Logout
                </button>
              ) : (
                <button className="nav-button" onClick={onLogin}>
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
