import React from 'react';
import styles from '../styles/Home.module.css';
import image from '../assets/images/home.png';

const Home = () => {
    return (
        <>
            <div className={styles.landing}>
                <div className={styles.text}>
                    <h1>The most comprehensive foreclosure database in the world.</h1>
                    <button></button>
                </div>
                <div>
                    <img src={image} alt="Placeholder" />
                </div>
            </div>
        </>
    )
}

export default Home;