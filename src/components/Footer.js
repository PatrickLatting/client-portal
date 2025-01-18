import React from "react";
// import styles from "../styles/Footer.module.css"

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Your Company Name. All Rights Reserved.</p>
        <ul className="footer-links">
          <li>
            <a href="/privacy-policy">Privacy Policy</a>
          </li>
          <li>
            <a href="/terms-of-service">Terms of Service</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;