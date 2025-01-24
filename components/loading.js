import { useState, useEffect } from 'react';

export default function Loading() {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsExiting(true), 1500); // Adjust duration
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`loading-container ${isExiting ? 'slide-up' : ''}`}>
            <div className="spinner"></div>
        </div>
    );
}