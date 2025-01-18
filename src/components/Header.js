import React from "react";
import Navbar from "./Navbar";
import Logo from "../assets/logos/1914Logo.png";
import styles from "../styles/Header.module.css"

const Header = () => {
    return (
        <header className={styles.header}>
            <div className="logo">
                <a href="/">
                    <img src={Logo} alt="Logo" />
                </a>
            </div>
            <Navbar />
        </header>
    );
};

export default Header;