"use client";

import { useState, useEffect } from 'react';
import '@/styles/global.css'; // Import global CSS file
import Header from '@/components/Header';
import Loading from '@/components/loading'; // Import the Loading component

export default function RootLayout({ children }) {
    const [isLoading, setIsLoading] = useState(true); // State to manage loading

    useEffect(() => {
        // Simulate loading delay or fetch data if necessary
        const timer = setTimeout(() => setIsLoading(false), 2000); // Adjust time as needed
        return () => clearTimeout(timer); // Clean up the timeout
    }, []);

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="title" content="Interactive Portfolio and Professional Info" />
                <meta name="description" content="An interactive portfolio showcasing professional information, artistic projects, and dynamic features built with Next.js." />
                <meta name="keywords" content="Portfolio, Next.js, Web Development, Professional Information, Artistic Projects" />
                <meta name="author" content="Clemens Waibel" />
                <meta name="theme-color" content="#fffdfa" />
                <meta property="og:title" content="Interactive Portfolio and Professional Info" />
                <meta property="og:description" content="An interactive portfolio showcasing professional information, artistic projects, and dynamic features built with Next.js." />
                <meta property="og:url" content="https://clemenswaibel.info" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://clemenswaibel.info/public/OCHO.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Interactive Portfolio and Professional Info" />
                <meta name="twitter:description" content="An interactive portfolio showcasing professional information, artistic projects, and dynamic features built with Next.js." />
                <meta name="twitter:image" content="https://clemenswaibel.info/public/OCHO.jpg" />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
            </head>
            <body>
                {isLoading && <Loading />} {/* Show Loading screen if still loading */}
                {!isLoading && (
                    <>
                        <Header />
                        <main>{children}</main>
                    </>
                )}
            </body>
        </html>
    );
}