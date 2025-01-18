import React from "react";
import Navbar from "./Navbar";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logos/1914Logo.png";
import styles from "../styles/Header.module.css"

const Header = () => {
    return (
        <header>
            <div className={styles.headerContent}>
                <div className={styles.logo}>
                    <NavLink to="/">
                        <img src={Logo} alt="Logo" />
                    </NavLink>
                </div>
                <div>
                    <Navbar />
                </div>
            </div>
        </header>
    );
};

export default Header;