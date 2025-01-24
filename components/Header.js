'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/Header.module.css';
import { createClient } from 'contentful';
import KUTE from 'kute.js';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

// Initialize Contentful client
const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');
    const [aboutMe, setAboutMe] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await client.getEntries({ content_type: 'info' });

                // Fetch logo
                const logoEntry = response.items.find(
                    (item) => item.fields.logo.fields.file.url && item.fields.logo.fields.file.contentType === 'image/svg+xml'
                );
                if (logoEntry) {
                    setLogoUrl(`https:${logoEntry.fields.logo.fields.file.url}`);
                }

                // Fetch aboutMe
                const aboutMeEntry = response.items.find((item) => item.fields.aboutMe);
                if (aboutMeEntry) {
                    setAboutMe(aboutMeEntry.fields.aboutMe);
                }
            } catch (error) {
                console.error('Error fetching data from Contentful:', error);
            }
        };

        fetchContent();
    }, []);

    const handleMenuToggle = () => {
        // Immediately add/remove the open class for overlay responsiveness
        const overlay = document.querySelector(`.${styles.overlayMenu}`);
        if (!menuOpen) {
            overlay.classList.add(styles.open);
        } else {
            overlay.classList.remove(styles.open);
        }

        // Trigger SVG morphing separately
        const circlePath =
            "M73.1,92.8c-19.3-1.7-18.8.6-29.6,1.8-10.1,1.1-15.8-11.8-19.8-21.2s-2.7-6.6-4.1-9.9-1.4-7.3.2-10.7c7.5-16.7,19.9-28.7,36.4-36.5,3.4-1.6,7.4-1.7,10.9-.3,5.7,2.3,11.3,4.7,17.1,7.1s14.9,13,15.5,21.6c.7,9.3,3.9,9.7-7.5,30.7-3.2,5.9-2.9,15.1-9,16.1s-.9.2-1.4.3c-2,.7-4.1,1.1-6.2,1h-2.5Z";
        const originalPath =
            "M80.7,15.3l-47.6-7.5c-2.7-.4-5.4.9-6.6,3.4L4.6,54.1c-1.2,2.4-.8,5.4,1.2,7.3l34.1,34.1c1.9,1.9,4.9,2.4,7.3,1.2l43-21.9c2.4-1.2,3.8-3.9,3.4-6.6l-7.5-47.6c-.4-2.7-2.5-4.8-5.2-5.2Z";

        const morph = menuOpen
            ? KUTE.fromTo(
                  `.${styles.menuIcon} path`,
                  { path: circlePath },
                  { path: originalPath },
                  { duration: 100, easing: 'easingCubicInOut' }
              )
            : KUTE.fromTo(
                  `.${styles.menuIcon} path`,
                  { path: originalPath },
                  { path: circlePath },
                  { duration: 100, easing: 'easingCubicInOut' }
              );

        morph.start();
        setMenuOpen(!menuOpen); // Update state after animations
    };

    return (
        <>
            <header className={styles.header} onClick={handleMenuToggle}>
                <div className={styles.headerIcon}>
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className={styles.logo} />
                    ) : (
                        <span>Loading...</span>
                    )}
                </div>
                <div className={styles.menuIcon} >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
                        <path
                            d="M80.7,15.3l-47.6-7.5c-2.7-.4-5.4.9-6.6,3.4L4.6,54.1c-1.2,2.4-.8,5.4,1.2,7.3l34.1,34.1c1.9,1.9,4.9,2.4,7.3,1.2l43-21.9c2.4-1.2,3.8-3.9,3.4-6.6l-7.5-47.6c-.4-2.7-2.5-4.8-5.2-5.2Z"
                        />
                    </svg>
                </div>
            </header>
            <div className={styles.overlayMenu}>
                <div className={styles.overlayTextFrame}>
                    <div className={styles.overlayText}>
                        {aboutMe ? documentToReactComponents(aboutMe) : <span>Loading About Me...</span>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;