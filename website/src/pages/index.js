import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
    {
        title: 'EHR',
        imageUrl: 'img/undraw_server.svg',
        description: <>Data exchange with any FHIR R4-based EHR</>,
    },
    {
        title: 'Vital Signs',
        imageUrl: 'img/undraw_medicine.svg',
        description: <>Visualize your vital signs and compare them with your activities in a timeline</>,
    },
    {
        title: 'Activity Tracking',
        imageUrl: 'img/undraw_Activity_tracker.svg',
        description: <>Organize and manage your activity data imported from different sources</>,
    },
    {
        title: 'Physical Data',
        imageUrl: 'img/undraw_metrics.svg',
        description: <>Physical Data plugin lets you keep track of your weight under control</>,
    },
    {
        title: 'Data Requests',
        imageUrl: 'img/undraw_mail.svg',
        description: <>Request and import data from your provider</>,
    },
    {
        title: 'Plugins',
        imageUrl: 'img/undraw_building_blocks.svg',
        description: (
            <>
                Plugins provided by developers like you for any other health-related data such as nutritional data,
                behavioral data, etc.
            </>
        ),
    },
];

function Feature({ imageUrl, title, description }) {
    const imgUrl = useBaseUrl(imageUrl);
    return (
        <div className={clsx('col col--4', styles.feature)}>
            {imgUrl && (
                <div className="text--center">
                    <img className={styles.featureImage} src={imgUrl} alt={title} />
                </div>
            )}
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

function Home() {
    const context = useDocusaurusContext();
    const { siteConfig = {} } = context;
    return (
        <Layout title="Docs" description="Private Electronic Health Records">
            <header className={clsx('hero hero--primary', styles.heroBanner)}>
                <div className="container">
                    <h1 className="hero__title">{siteConfig.title}</h1>
                    <p className="hero__subtitle">{siteConfig.tagline}</p>
                    <div className={styles.buttons}>
                        <Link
                            className={clsx('button button--outline button--secondary button--lg', styles.getStarted)}
                            to={useBaseUrl('docs/')}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>
            <main>
                {features && features.length > 0 && (
                    <section className={styles.features}>
                        <div className="container">
                            <div className="row">
                                {features.map((props, idx) => (
                                    <Feature key={idx} {...props} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
                <div className={styles.aboutContainer}>
                    <section className={styles.about}>
                        <div>
                            Kailona ("kailo-" Proto-Indo-European for "whole, uninjured, of good omen") provides a
                            global open-source platform for developers that allows individuals to make healthier choices
                            and the research and developer community to accelerate health innovation. We are an
                            international team of designers, sociologists, anthropologists, and engineers passionate
                            about the dignity, self-determination, trust and healing of people all over the globe.
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            The Kailona team is proud to be sponsored by the Prototype Fund, a project of the Open
                            Knowledge Foundation Germany, funded by the Federal Ministry of Education and Research
                            (BMBF) Förderkennzeichen 01|S20S38, MEDKEN, ACANIO and TOCA.
                        </div>
                    </section>
                </div>
            </main>
        </Layout>
    );
}

export default Home;
