'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import styles from '@/styles/VerticalReel.module.css';
import { createClient } from 'contentful';

const colors = ['#00A36C', '#96DED1', '#008080', '#E97451', '#E5AA70', '#D2B48C', '#50C878', '#9FE2BF', '#FF7F50'];

const HALF_IMAGE_VISIBLE = 0.2;
const VIEWPORT_COVERAGE = 0.8;

const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const VerticalReel = () => {
    const [images, setImages] = useState([]);
    const containerRef = useRef(null);
    const observer = useRef(null);
    const modifier = 200;
    const spacing = typeof window !== 'undefined' ? window.innerHeight * 0.15 : 0;

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await client.getEntries({ content_type: 'work',order: 'fields.order'});
                const fetchedImages = response.items
                    .filter((item) => item.fields.media && item.fields.media.fields && item.fields.media.fields.file)
                    .map((item) => ({
                        src: item.fields.media.fields.file.url.startsWith('http')
                            ? item.fields.media.fields.file.url
                            : `https:${item.fields.media.fields.file.url}`,
                        title: item.fields.title || 'Untitled',
                        size: item.fields.size || 80,
                        left: item.fields.offsetX || 10,
                        top: item.fields.offsetY || 0,
                        height: item.fields.media.fields.file.details.image.height||800,
                        width: item.fields.media.fields.file.details.image.width||500,
                    }));

                if (fetchedImages.length === 0) {
                    console.warn('No images found in the fetched data.');
                }
                setImages(fetchedImages);
            } catch (error) {
                console.error('Error fetching images from Contentful:', error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const documentHeight = document.body.scrollHeight;
            const currentScroll = window.scrollY + window.innerHeight;

            if (currentScroll + modifier >= documentHeight) {
                setImages((prevItems) => [...prevItems, ...images]);
            }
        };

        const observerOptions = {
            root: null,
            threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                const imageWrapper = entry.target;
                const overlay = imageWrapper.querySelector(`.${styles.overlay}`);
                const intersectionRatio = entry.intersectionRatio;

                if (intersectionRatio < HALF_IMAGE_VISIBLE) {
                    overlay.style.opacity = 1;
                } else if (intersectionRatio >= HALF_IMAGE_VISIBLE && intersectionRatio <= VIEWPORT_COVERAGE) {
                    overlay.style.opacity =
                        1 - ((intersectionRatio - HALF_IMAGE_VISIBLE) / (VIEWPORT_COVERAGE - HALF_IMAGE_VISIBLE));
                } else {
                    overlay.style.opacity = 0;
                }
            });
        };

        observer.current = new IntersectionObserver(observerCallback, observerOptions);

        if (containerRef.current) {
            const elements = containerRef.current.querySelectorAll(`.${styles.imageWrapper}`);
            elements.forEach((element) => observer.current.observe(element));
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (observer.current) observer.current.disconnect();
        };
    }, [images]);

    const renderImages = () => {
        return images.map((image, index) => (
            <div
                key={index}
                style={{
                    width: `${image.size}%`,
                    transform: `translate(${image.left}%, ${image.top}%)`,
                    marginBottom: `${spacing}px`,
                }}
                className={styles.imageWrapper}
            >
               <Image
    src={image.src}
    alt={`Scrolling Image ${index + 1}`}
    className={styles.scrollingImage}
    width={image.width} // Specify the width explicitly
    height={image.height} // Specify the height explicitly
                quality={100}
     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    priority={index === 0} // Prioritize loading the first image
/>
                <div
                    className={styles.overlay}
                    style={{ backgroundColor: colors[index % colors.length], opacity: 1 }}
                ></div>
            </div>
        ));
    };

    return <div className={styles.imageContainer} ref={containerRef}>{renderImages()}</div>;
};

export default VerticalReel;




// height:item.fields.media.fields.file.details.image.height||800,
// width:item.fields.media.fields.file.details.image.width||500,




// import React, { useEffect, useRef, useState } from 'react';
// import styles from '@/styles/VerticalReel.module.css';
// import { createClient } from 'contentful';

// const colors = ['#00A36C', '#96DED1', '#008080', '#E97451', '#E5AA70', '#D2B48C', '#50C878', '#9FE2BF', '#FF7F50'];

// const HALF_IMAGE_VISIBLE = 0.2;
// const VIEWPORT_COVERAGE = 0.5;

// const client = createClient({
//     space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID, // Update for Next.js
//     accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
// });

// const VerticalReel = () => {
//     const [images, setImages] = useState([]);
//     const containerRef = useRef(null);

//     useEffect(() => {
//         const fetchImages = async () => {
//             try {
//                 const response = await client.getEntries({ content_type: 'work' }); // Use your content type ID
//                 console.log(response.items)
//                 const fetchedImages = response.items
//                     .filter((item) => item.fields.media && item.fields.media.fields && item.fields.media.fields.file) // Ensure fields exist
//                     .map((item) => ({
//                         src: item.fields.media.fields.file.url.startsWith('http')
//                             ? item.fields.media.fields.file.url
//                             : `https:${item.fields.media.fields.file.url}`, // Ensure absolute URL
//                         title: item.fields.title || 'Untitled', // Fallback to "Untitled" if title is missing
//                         size: item.fields.size||80, // Add a default size; customize if you have size info in Contentful
//                         left: item.fields.offsetX||0, // Default left position
//                         top: item.fields.offsetY||0, // Default top position
//                     }));
        
//                 if (fetchedImages.length === 0) {
//                     console.warn('No images found in the fetched data.');
//                 }
        
//                 setImages(fetchedImages);
//             } catch (error) {
//                 console.error('Error fetching images from Contentful:', error);
//             }
//         };
//         fetchImages();
//     }, []);

//     return (
//         <div className={styles.imageContainer} ref={containerRef}>
//             {images.map((image, index) => (
//                 <div
//                     key={index}
//                     className={styles.imageWrapper}
//                     style={{
//                         width: `${image.size}%`,
//                         transform: `translate(${image.left}%, ${image.top}%)`,
//                     }}
//                 >
//                     <img src={image.src} alt={`Image ${index}`} className={styles.scrollingImage} />
//                     <div
//                         className={styles.overlay}
//                         style={{ backgroundColor: colors[index % colors.length] }}
//                     ></div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default VerticalReel;