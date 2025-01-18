import React from 'react';
import styles from '../styles/Home.module.css';
import image from '../assets/images/home.png';
import { NavLink } from'react-router-dom';
import HousesDatabase from '../components/HousesDatabase';

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

            {/* All content below this line can only be view once logged in */}
            <div className={styles.welcomebanner}>
                <h1>Welcome back, Name!</h1>
            </div>
            <div className={styles.databaseHeader}>
                <h2>Search for Georgia, Tennessee, and Virginia Foreclosures</h2>
                <p>We offer the most comprehensive forecolusure database in the world. Find, reserach, get images, and bid remotely.</p>
            </div>
            <HousesDatabase />
        </>
    )
}

export default Home;