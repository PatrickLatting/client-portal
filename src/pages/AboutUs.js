import React from 'react';
import styles from '../styles/AboutUs.module.css';
import image from '../assets/images/stock1.png';

const AboutUs = () => {
    return (
        <>
            {/* landing */}
            <div className={styles.landing}>
                <div className={styles.landingText}>
                    <h1>We do some crazy sh*t, yo</h1>
                    <p className='subtitle'>subtitle</p>
                    <button>Request a f#$%ing demo</button>
                </div>
                <div className={styles.image}>
                    <img src={image} alt="Placeholder" />
                </div>
            </div>

            {/* Three things */}
            <div className={styles.threethings}>
                <div className={styles.header}>
                    <h2>We do Three Things</h2>
                </div>
                <div>
                    <h3>Data</h3>
                    <p>We empower millions of customers around the world to start and grow their businesses with our smart marketing technology, award-winning support, and inspiring content.</p>
                </div>
                <div>
                    <h3>Diligence</h3>
                    <p>We empower millions of customers around the world to start and grow their businesses with our smart marketing technology, award-winning support, and inspiring content.</p>
                </div>
                <div>
                    <h3>Acquisition</h3>
                    <p>We empower millions of customers around the world to start and grow their businesses with our smart marketing technology, award-winning support, and inspiring content.</p>
                </div>
            </div>

            {/* Team */}
            <div className={styles.team}>
                <div className={styles.header}>
                    <h2>The Team</h2>
                    <p>Meet our small team that make those great products.</p>
                </div>
                <div className={styles.teammembers}>
                    {/* Evan */}
                    <div className={styles.teammember}>
                        <img className={styles.profile} alt="Evan's profile"></img>
                        <h3>Evan Woska</h3>
                        <p className={styles.jobtitle}>Managing Partner</p>
                        <p>Description</p>
                        <ul className={styles.socialmedia}>
                            <li><a href="#"></a></li>
                            <li><a href="#"></a></li>
                            <li><a href="#"></a></li>
                            <li><a href="#"></a></li>
                        </ul>
                    </div>
                    {/* Patrick */}
                    <div className={styles.teammember}>
                        <img className={styles.profile} alt="Patrick's profile"></img>
                        <h3>Patrick Latting</h3>
                        <p className={styles.jobtitle}>Managing Partner</p>
                        <p>Description</p>
                        <ul className={styles.socialmedia}>
                            <li><a href="#"></a></li>
                            <li><a href="#"></a></li>
                            <li><a href="#"></a></li>
                            <li><a href="#"></a></li>
                        </ul>
                    </div>
                    {/* Jack */}
                    <div className={styles.teammember}>
                        <img className={styles.profile} alt="Jack's profile"></img>
                        <h3>Jack Petkash</h3>
                        <p className={styles.jobtitle}>Vice President of Operations</p>
                        <p>Description</p>
                        <ul className={styles.socialmedia}>
                            <li><a href="#"></a></li>
                            <li><a href="#"></a></li>
                            <li><a href="#"></a></li>
                            <li><a href="#"></a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Quote */}
            <div className={styles.quote}>
                <h2>I strongly belive that something, of some kind, should go here</h2>
                <p>Get more leads, sort sales in one place and eliminate admin, becasue your day belongs to you.</p>
            </div>


            {/* Features */}
            <div className={styles.features}>
                <div className={styles.feature}>
                    <div>
                        <img src={image} alt="Placeholder" />
                    </div>
                    <div>
                        <h3>Manage Leads and Deals</h3>
                        <p>Get more hot leads fed straight into your sales pipelines around the clock.</p>
                    </div>
                </div>
                <div className={styles.feature}>
                    <div>
                        <img src={image} alt="Placeholder" />
                    </div>
                    <div>
                        <h3>Track Communications</h3>
                        <p>Track Communications: Track calls, emails and contact history exactly where you need.</p>
                    </div>
                </div>
                <div className={styles.feature}>
                    <div>
                        <img src={image} alt="Placeholder" />
                    </div>
                    <div>
                        <h3>Automate and Grow</h3>
                        <p>Automate and Grow: Eliminate busywork by automating repetitive administrative tasks.</p>
                    </div>
                </div>
                <div className={styles.feature}>
                    <div>
                        <img src={image} alt="Placeholder" />
                    </div>
                    <div>
                        <h3>Insights and Reports</h3>
                        <p>Insights and Reports: Deep dive into metrics customized for your business and measure goals.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AboutUs;