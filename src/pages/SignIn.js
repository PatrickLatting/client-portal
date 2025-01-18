import React from 'react';
import styles from '../styles/SignIn.module.css';
import Logo from "../assets/logos/1914Logo.png";


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
                            <label htmlFor="username">Email</label>
                            <div className={styles.input}>
                                <input type="text" id="username" name="username" required />
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
                        <a href='./sign-up'>
                            Sign Up
                        </a>
                        <a href='./reset-password/:token'>
                            Forgot your password?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn;