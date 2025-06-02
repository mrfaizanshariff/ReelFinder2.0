"use client"

import { useEffect, useRef } from 'react';

export function InstagramEmbed() {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.defer = true;
      
      // script.onload = () => {
      //   // Process any existing embeds when the script loads
      //   if (window.instgrm) {
      //     window.instgrm.Embeds.process();
      //   }
      // };
      
      document.body.appendChild(script);
      scriptLoaded.current = true;
      
      // Clean up on unmount
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return null; // This component doesn't render anything visible
}