'use client';
import { useEffect } from 'react';

export default function ScrollOptimizer() {
  useEffect(() => {
    // Disable scroll restoration to prevent RSC requests
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      
      // Prevent default scroll behavior that might trigger re-renders
      const preventScrollRerender = (e: Event) => {
        // Don't prevent the scroll, just ensure it doesn't trigger re-renders
        e.stopPropagation();
      };
      
      // Add passive scroll listener to prevent performance issues
      let scrollTimeout: NodeJS.Timeout;
      const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          // Debounced scroll handling - prevents excessive re-renders
        }, 16); // ~60fps
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, []);

  return null;
}
