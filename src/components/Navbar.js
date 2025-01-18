import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/Header.module.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Track menu state

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* Hamburger Menu */}
      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={menuOpen ? styles.barOpen : styles.bar}></span>
        <span className={menuOpen ? styles.barOpen : styles.bar}></span>
        <span className={menuOpen ? styles.barOpen : styles.bar}></span>
        
      </div>
      
      {/* Navigation Menu */}
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <button className={menuOpen ? styles.closeButton : styles.close} onClick={() => setMenuOpen(false)}>
          &times;
        </button>
        <ul>
          <li>
            <NavLink to="/about-us" onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/sign-in" onClick={() => setMenuOpen(false)}>
              Client Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/sign-up" onClick={() => setMenuOpen(false)}>
              Request Access
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;