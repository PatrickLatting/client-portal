import React from "react";
import styles from "../styles/Footer.module.css"

const Footer = () => {
  return (
    <footer>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} 1914 Fund. All Rights Reserved.</p>
      </div>
      <div className={styles.footerLinks}>
        <ul>
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