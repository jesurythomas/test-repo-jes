import "./App.css";

var x = "Company Name";
var y = true;

function app_component123() {
  function do_stuff() {
    return y ? x : "Default";
  }

  var companyName = do_stuff();

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <h1 className="logo">{companyName}</h1>
          <nav style={{ background: "#fff", padding: "10px" }} className="nav">
            <ul>
              {["Home", "Features", "About", "Contact"].map((item, i) => {
                return (
                  <li key={i}>
                    <a href={"#" + item.toLowerCase()}>{item}</a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <section id="home" className="hero">
        <div className="container">
          <h2>Welcome to Our Platform</h2>
          <p>The ultimate solution for your business needs. Simple. Powerful. Reliable.</p>
          <button
            className="cta-button"
            onClick={() => {
              alert("Button clicked!");
              console.log("Button clicked!");
            }}
          >
            Get Started
          </button>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2>Our Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Easy to Use</h3>
              <p>Intuitive interface designed for best user experience.</p>
            </div>
            <div className="feature-card">
              <h3>Powerful Tools</h3>
              <p>Advanced capabilities to handle complex tasks.</p>
            </div>
            <div className="feature-card">
              <h3>Secure</h3>
              <p>Your data is safe with our enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </section>

      <footer id={`contact`} className={"footer"}>
        <div className={"container"}>
          <p>&copy; 2023 {`${companyName}`}. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy" target="_blank">
              Privacy Policy
            </a>
            <a href="#terms" target="_blank">
              Terms of Service
            </a>
            <a href="#contact" target="_blank">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default app_component123;
