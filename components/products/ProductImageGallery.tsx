'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FiZoomIn, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageGalleryProps {
    images: string[];
    productName?: string;
}

export default function ProductImageGallery({ images, productName = 'Product' }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const zoomRef = useRef<HTMLDivElement>(null);

    // Fallback if no images
    const displayImages = images.length > 0 ? images : ['/images/placeholder.jpg'];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed || !imageContainerRef.current) return;

        const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({ x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) });
    };

    const handleZoomIn = () => {
        setIsZoomed(true);
    };

    const handleZoomOut = () => {
        setIsZoomed(false);
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        document.body.style.overflow = 'unset';
    };

    const nextImage = () => {
        setLightboxIndex((prev) => (prev + 1) % displayImages.length);
    };

    const previousImage = () => {
        setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;

            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') previousImage();
            if (e.key === 'Escape') closeLightbox();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, lightboxIndex]);

    return (
        <div className="space-y-4">
            {/* Main Image Container */}
            <div
                ref={imageContainerRef}
                className="relative bg-gray-100 rounded-lg overflow-hidden group"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setIsZoomed(false)}
            >
                <div className="relative aspect-square">
                    <Image
                        src={displayImages[selectedImage]}
                        alt={`${productName} - Image ${selectedImage + 1}`}
                        fill
                        className={`object-cover transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                            }`}
                        style={{
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={selectedImage === 0}
                    />
                </div>

                {/* Zoom Button */}
                <button
                    onClick={isZoomed ? handleZoomOut : handleZoomIn}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                    aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
                >
                    <FiZoomIn size={20} className="text-gray-700" />
                </button>

                {/* Fullscreen Button */}
                <button
                    onClick={() => openLightbox(selectedImage)}
                    className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                    aria-label="View fullscreen"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                </button>

                {/* Image Counter */}
                {displayImages.length > 1 && (
                    <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white text-sm">
                        {selectedImage + 1} / {displayImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Navigation */}
            {displayImages.length > 1 && (
                <div className="relative">
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                        {displayImages.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === index
                                        ? 'border-primary shadow-md scale-95'
                                        : 'border-transparent hover:border-gray-300'
                                    }`}
                                aria-label={`View image ${index + 1}`}
                            >
                                <Image
                                    src={image}
                                    alt={`${productName} thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 25vw, 10vw"
                                />
                                {selectedImage === index && (
                                    <div className="absolute inset-0 bg-primary/10" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition"
                            aria-label="Close lightbox"
                        >
                            <FiX size={32} />
                        </button>

                        {/* Navigation Buttons */}
                        {displayImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        previousImage();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-gray-300 transition bg-black/50 rounded-full hover:bg-black/70"
                                    aria-label="Previous image"
                                >
                                    <FiChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-gray-300 transition bg-black/50 rounded-full hover:bg-black/70"
                                    aria-label="Next image"
                                >
                                    <FiChevronRight size={32} />
                                </button>
                            </>
                        )}

                        {/* Main Lightbox Image */}
                        <div
                            className="relative w-full max-w-5xl h-full max-h-[90vh] mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={displayImages[lightboxIndex]}
                                alt={`${productName} - Fullscreen ${lightboxIndex + 1}`}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />

                            {/* Image Counter in Lightbox */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
                                {lightboxIndex + 1} / {displayImages.length}
                            </div>
                        </div>

                        {/* Thumbnails in Lightbox */}
                        {displayImages.length > 1 && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm">
                                {displayImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLightboxIndex(index);
                                        }}
                                        className={`relative w-12 h-12 rounded overflow-hidden border-2 transition ${lightboxIndex === index
                                                ? 'border-white scale-110'
                                                : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}