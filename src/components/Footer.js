import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <span>© {new Date().getFullYear()} Ath Tripathi</span>
    
    <div className="footer-socials">
      <a
        href="https://www.linkedin.com/in/ath-tripathi-320115230/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <i className="fab fa-linkedin"></i>
      </a>

      <a
        href="https://github.com/ath34-tech"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        <i className="fab fa-github"></i>
      </a>

      <a
        href="https://codeforces.com/profile/athtripathi"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Codeforces"
      >
        <span className="cf">CF</span>
      </a>

      <a
        href="https://www.codechef.com/users/secretmagician"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="CodeChef"
      >
        <span className="cc">CC</span>
      </a>
    </div>
  </footer>
);

export default Footer;
