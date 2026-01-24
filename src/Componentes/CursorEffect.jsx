'use client';
import React, { useEffect, useState, useRef } from 'react';

const CursorEffect = () => {
    const mousePosition = useRef({ x: 0, y: 0 });
    const [trail, setTrail] = useState([]);
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            mousePosition.current = { x: clientX, y: clientY };

            // Check if hovering over clickable elements
            const target = e.target;
            if (target && target instanceof Element) {
                const computedStyle = window.getComputedStyle(target);
                setIsPointer(
                    computedStyle.cursor === 'pointer' || 
                    target.tagName === 'A' || 
                    target.tagName === 'BUTTON' ||
                    target.closest('a') !== null ||
                    target.closest('button') !== null
                );
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        let animationFrameId;
        
        // Initialize trail with some dots
        const TRAIL_LENGTH = 12;
        const initialTrail = Array(TRAIL_LENGTH).fill({ x: 0, y: 0 });
        setTrail(initialTrail);

        const updateTrail = () => {
            setTrail(prevTrail => {
                const newTrail = [...prevTrail];
                // Move the first point towards the mouse
                const dx = mousePosition.current.x - newTrail[0].x;
                const dy = mousePosition.current.y - newTrail[0].y;
                
                newTrail[0] = {
                    x: newTrail[0].x + dx * 0.4,
                    y: newTrail[0].y + dy * 0.4
                };

                // Move subsequent points towards the previous point
                for (let i = 1; i < newTrail.length; i++) {
                    const prevPoint = newTrail[i - 1];
                    const currPoint = newTrail[i];
                    const diffX = prevPoint.x - currPoint.x;
                    const diffY = prevPoint.y - currPoint.y;

                    newTrail[i] = {
                        x: currPoint.x + diffX * 0.35,
                        y: currPoint.y + diffY * 0.35
                    };
                }
                return newTrail;
            });

            animationFrameId = requestAnimationFrame(updateTrail);
        };

        animationFrameId = requestAnimationFrame(updateTrail);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);
    
    return (
        <div className="pointer-events-none fixed top-0 left-0 z-50 hidden md:block">
            {trail.map((point, index) => (
                <div 
                    key={index}
                    className={`absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 ${
                        index === 0 ? 'bg-blue-600' : 'bg-blue-400'
                    }`}
                    style={{ 
                        left: `${point.x}px`, 
                        top: `${point.y}px`,
                        width: index === 0 ? (isPointer ? '8px' : '10px') : `${Math.max(2, 12 - index)}px`,
                        height: index === 0 ? (isPointer ? '8px' : '10px') : `${Math.max(2, 12 - index)}px`,
                        opacity: isPointer && index === 0 ? 0 : (1 - index / trail.length),
                        zIndex: 50 - index
                    }}
                />
            ))}
        </div>
    );
};

export default CursorEffect;
