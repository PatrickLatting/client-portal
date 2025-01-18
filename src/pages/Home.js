import React from 'react';
import styles from '../styles/Home.module.css';
import image from '../assets/images/home.png';
import { NavLink } from'react-router-dom';

const Home = () => {
    return (
        <>
            <div className={styles.landing}>
                <div className={styles.content}>
                    <div className={styles.text}>
                        <h1>The most comprehensive foreclosure database in the world.</h1>
                        <NavLink to="/sign-in" className={styles.cta}>Client Login</NavLink>
                    </div>
                    <div className={styles.image}>
                        <img src={image} alt="Placeholder" />
                    </div>
                </div>
            
            </div>
        </>
    )
}

export default Home;