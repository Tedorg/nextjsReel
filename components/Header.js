'use client'; // Required for client-side rendering

import React, { useEffect, useState } from 'react';
import styles from '@/styles/Header.module.css';
import { createClient } from 'contentful';
import KUTE from 'kute.js'; // Import KUTE.js for animations
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'; // Import Rich Text Renderer


// Initialize Contentful client
const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');
    const [aboutMe, setAboutMe] = useState(null); // Store the rich text

    // Fetch SVG logo from Contentful
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await client.getEntries({ content_type: 'info' });
                console.log(response)
                const logoEntry = response.items.find(
                    (item) => item.fields.logo.fields.file.url && item.fields.logo.fields.file.contentType === 'image/svg+xml'
                );
                if (logoEntry) {
                    const logoFileUrl = logoEntry.fields.logo.fields.file.url;
                    setLogoUrl(`https:${logoFileUrl}`);
                }
                 // Fetch aboutMe rich text
                 const aboutMeEntry = response.items.find((item) => item.fields.aboutMe);
                 if (aboutMeEntry) {
                     setAboutMe(aboutMeEntry.fields.aboutMe);
                 }

            } catch (error) {
                console.error('Error fetching logo from Contentful:', error);
            }
        };

        fetchLogo();
    }, []);

    // Morph SVG paths using KUTE.js
    useEffect(() => {
        const circlePath =
            "M90.5,110.6c-15.9,0-31.8.2-47.6.2-15.3,0-29.2-9.1-35.1-23.2s-4.1-9.9-6.2-14.8-2.1-11,.3-16.1C13.1,31.6,31.7,13.6,56.5,1.9c5.1-2.4,11.1-2.6,16.3-.4,8.5,3.5,17,7.1,25.6,10.7s22.4,19.5,23.3,32.4c1.1,14,5.9,14.6-11.3,46-5.3,9.7-8.9,20-20,20.1Z";
        const originalPath = "M80.7,15.3l-47.6-7.5c-2.7-.4-5.4.9-6.6,3.4L4.6,54.1c-1.2,2.4-.8,5.4,1.2,7.3l34.1,34.1c1.9,1.9,4.9,2.4,7.3,1.2l43-21.9c2.4-1.2,3.8-3.9,3.4-6.6l-7.5-47.6c-.4-2.7-2.5-4.8-5.2-5.2Z";

        const morph = menuOpen
            ? KUTE.fromTo(
                  `.${styles.menuIcon} path`, // Target the path element
                  { path: originalPath },
                  { path: circlePath },
                  { duration: 100, easing: 'easingCubicInOut' }
              )
            : KUTE.fromTo(
                  `.${styles.menuIcon} path`,
                  { path: circlePath },
                  { path: originalPath },
                  { duration: 100, easing: 'easingCubicInOut' }
              );

        morph.start(); // Start the morphing animation
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.headerIcon}>
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className={styles.logo} />
                    ) : (
                        <span>Loading...</span>
                    )}
                </div>
                <div className={styles.menuIcon} onClick={toggleMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="70" height="70">
                        <path
                            d="M80.7,15.3l-47.6-7.5c-2.7-.4-5.4.9-6.6,3.4L4.6,54.1c-1.2,2.4-.8,5.4,1.2,7.3l34.1,34.1c1.9,1.9,4.9,2.4,7.3,1.2l43-21.9c2.4-1.2,3.8-3.9,3.4-6.6l-7.5-47.6c-.4-2.7-2.5-4.8-5.2-5.2Z"
                           
                        />
                    </svg>
                </div>
            </header>
            <div className={`${styles.overlayMenu} ${menuOpen ? styles.open : ''}`}>
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