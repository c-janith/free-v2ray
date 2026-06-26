import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Adsterra Popunder Ad Script
 * 
 * This component conditionally loads the Adsterra popunder script.
 * It is automatically DISABLED when the user is in the ad-watching flow
 * on the VPN config page, so only the direct-link ads fire.
 * 
 * Setup:
 * 1. Go to Admin → Settings
 * 2. Paste your Adsterra popunder script URL in the "Popunder Script URL" field
 * 3. The URL looks like: https://www.adsterra.com/your-popunder-id.js
 */
export default function AdsterraPopunder() {
  const { watchingAds, settings } = useApp();
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptUrl = settings.popunderScriptUrl;
    if (!scriptUrl || !containerRef.current) return;

    if (watchingAds) {
      // Remove popunder script when user is watching ads
      if (scriptRef.current && scriptRef.current.parentElement) {
        scriptRef.current.parentElement.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      // Also try to remove any adsterra popunder elements that may have been injected
      cleanupPopunderElements();
    } else {
      // Load popunder script when user is NOT watching ads
      if (!scriptRef.current) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = scriptUrl;
        script.setAttribute('data-adsterra-popunder', 'true');
        containerRef.current.appendChild(script);
        scriptRef.current = script;
      }
    }

    return () => {
      // Cleanup on unmount
      if (scriptRef.current && scriptRef.current.parentElement) {
        scriptRef.current.parentElement.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [watchingAds, settings.popunderScriptUrl]);

  return <div ref={containerRef} style={{ display: 'none' }} data-adsterra-container="popunder" />;
}

function cleanupPopunderElements() {
  // Remove any injected popunder elements from Adsterra
  try {
    const selectors = [
      '[id*="adsterra"]',
      '[class*="adsterra"]',
      'script[data-adsterra-popunder]',
      'div[data-adsterra-container]',
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.getAttribute('data-adsterra-container') !== 'popunder') {
          el.remove();
        }
      });
    });
  } catch {
    // Silent fail
  }
}
