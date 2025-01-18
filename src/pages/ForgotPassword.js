import React from 'react';
import styles from "../styles/ForgotPassword.module.css";
import Logo from "../assets/logos/1914Logo.png";

const ForgotPassword = () => {
    return (
        <>
            <div className={styles.landing}>
                <div className={styles.login}>
                    <div className={styles.rectangle}>
                        <div className={styles.formheader}>
                            <div className={styles.logo}>
                                <img src={Logo} alt="Logo" />
                            </div>
                            <h1>Forgot password</h1>
                        </div>
                        <div className={styles.form}>
                            <input type="email" id="email" name="email" placeholder='Your email' required />
                            <button type='submit'>
                                Recover password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword;