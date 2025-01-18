import React from 'react';
import styles from '../styles/SignIn.module.css';
import Logo from "../assets/logos/1914Logo.png";
import { Link } from "react-router-dom";


const SignIn = () => {
    return (
        <div className={styles.landing}>
            <div className={styles.login}>
                <div className={styles.rectangle}>
                    <div className={styles.formheader}>
                        <div className={styles.logo}>
                            <img src={Logo} alt="Logo" />
                        </div>
                        <h1>Client Portal</h1>
                    </div>
                    <div className={styles.form}>
                        <div className={styles.inputs}>
                            <label htmlFor="email">Email</label>
                            <div className={styles.input}>
                                <input type="text" id="email" name="email" required />
                            </div>
                        </div>
                        <div className={styles.inputs}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.input}>
                                <input type="password" id="password" name="password" required />
                            </div>
                            
                        </div>
                        <button type='submit'>
                            Sign In
                        </button>
                        <Link to="/sign-up">
                            Sign Up
                        </Link>
                        <Link to="/forgot-password">
                            Forgot your password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn;