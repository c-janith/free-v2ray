import { useState, useEffect, useCallback, useRef } from 'react';

export type AdBlockType =
  | 'brave-shields'
  | 'ublock-origin'
  | 'adblock-plus'
  | 'adguard-extension'
  | 'ghostery'
  | 'opera-built-in'
  | 'edge-tracking'
  | 'firefox-enhanced'
  | 'vivaldi-tracker'
  | 'samsung-adblock'
  | 'safari-content-blocker'
  | 'chrome-adblock'
  | 'dns-blocker'
  | 'unknown';

interface AdBlockResult {
  detected: boolean;
  type: AdBlockType;
  browserName: string;
  checking: boolean;
  recheck: () => void;
}

function detectBrowser(): { name: string; isBrave: boolean; isOpera: boolean; isEdge: boolean; isFirefox: boolean; isVivaldi: boolean; isSamsung: boolean; isSafari: boolean; isChrome: boolean } {
  const ua = navigator.userAgent;
  const isBrave = !!(navigator as any).brave || /brave/i.test(ua);
  const isOpera = !!((window as any).opr?.addons) || !!((window as any).opera) || /OPR\//i.test(ua);
  const isEdge = /Edg(e|\/|A)/i.test(ua);
  const isFirefox = /Firefox/i.test(ua);
  const isVivaldi = /Vivaldi/i.test(ua);
  const isSamsung = /SamsungBrowser/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR|Vivaldi|Brave/i.test(ua);
  const isChrome = /Chrome|Chromium/i.test(ua) && !isEdge && !isOpera && !isVivaldi && !isBrave;

  let name = 'Unknown';
  if (isBrave) name = 'Brave';
  else if (isVivaldi) name = 'Vivaldi';
  else if (isOpera) name = 'Opera';
  else if (isEdge) name = 'Edge';
  else if (isSamsung) name = 'Samsung Internet';
  else if (isFirefox) name = 'Firefox';
  else if (isSafari) name = 'Safari';
  else if (isChrome) name = 'Chrome';

  return { name, isBrave, isOpera, isEdge, isFirefox, isVivaldi, isSamsung, isSafari, isChrome };
}

async function detectExtensionType(): Promise<AdBlockType | null> {
  // Check for AdGuard desktop/extension
  if ((window as any).adguard || (document.documentElement as any).adguard) return 'adguard-extension';

  // Check for Ghostery
  try {
    const ghostEl = document.querySelector('[id*="ghostery"], [class*="ghostery"]');
    if (ghostEl) return 'ghostery';
  } catch { /* */ }

  // Check for uBlock Origin by trying to detect its specific resource blocking
  try {
    const uboTest = document.createElement('link');
    uboTest.rel = 'stylesheet';
    uboTest.href = 'chrome-extension://cjpalhdlnbpafiamejdnhcphjbkeiagm/css/1p-filters.css';
    uboTest.id = 'gvh-ubo-test';
    document.head.appendChild(uboTest);
    await new Promise(r => setTimeout(r, 50));
    const uboEl = document.getElementById('gvh-ubo-test');
    const uboDetected = uboEl && (uboEl as HTMLLinkElement).sheet === null;
    uboEl?.remove();
    if (uboDetected) return 'ublock-origin';
  } catch { /* */ }

  // Check for AdBlock Plus
  try {
    const abpTest = document.createElement('div');
    abpTest.id = 'abp-notice';
    abpTest.className = 'abp-notice ad-banner';
    abpTest.style.cssText = 'position:absolute;top:-9999px;left:-9999px;';
    document.body.appendChild(abpTest);
    await new Promise(r => setTimeout(r, 100));
    const abpEl = document.getElementById('abp-notice');
    if (abpEl) {
      const style = window.getComputedStyle(abpEl);
      if (style.display === 'none' || abpEl.offsetHeight === 0) {
        abpEl.remove();
        return 'adblock-plus';
      }
    }
    abpEl?.remove();
  } catch { /* */ }

  return null;
}

export function useAdBlockDetector(): AdBlockResult {
  const [detected, setDetected] = useState(false);
  const [type, setType] = useState<AdBlockType>('unknown');
  const [browserName, setBrowserName] = useState('Unknown');
  const [checking, setChecking] = useState(true);
  const checkCount = useRef(0);

  const runDetection = useCallback(async () => {
    setChecking(true);
    checkCount.current += 1;

    const browser = detectBrowser();
    setBrowserName(browser.name);

    // Brave detection
    if (browser.isBrave) {
      try {
        if ((navigator as any).brave?.isBrave) {
          const confirmed = await (navigator as any).brave.isBrave();
          if (confirmed) {
            // Run bait test to confirm shields are active
            const blocked = await runBaitTest();
            if (blocked) {
              setDetected(true);
              setType('brave-shields');
              setChecking(false);
              return;
            }
          }
        }
      } catch { /* */ }
      // If brave.isBrave() threw or bait wasn't blocked, still likely Brave
      const blocked = await runBaitTest();
      if (blocked) {
        setDetected(true);
        setType('brave-shields');
        setChecking(false);
        return;
      }
    }

    // Generic ad block detection via bait
    const blocked = await runBaitTest();

    if (!blocked) {
      setDetected(false);
      setChecking(false);
      return;
    }

    // Ad blocker detected — figure out which one
    // First check for known extensions
    const extType = await detectExtensionType();
    if (extType) {
      setDetected(true);
      setType(extType);
      setChecking(false);
      return;
    }

    // Then check browser built-in blockers
    if (browser.isOpera) {
      setDetected(true);
      setType('opera-built-in');
      setChecking(false);
      return;
    }

    if (browser.isVivaldi) {
      setDetected(true);
      setType('vivaldi-tracker');
      setChecking(false);
      return;
    }

    if (browser.isEdge) {
      setDetected(true);
      setType('edge-tracking');
      setChecking(false);
      return;
    }

    if (browser.isSamsung) {
      setDetected(true);
      setType('samsung-adblock');
      setChecking(false);
      return;
    }

    if (browser.isFirefox) {
      setDetected(true);
      setType('firefox-enhanced');
      setChecking(false);
      return;
    }

    if (browser.isSafari) {
      setDetected(true);
      setType('safari-content-blocker');
      setChecking(false);
      return;
    }

    if (browser.isChrome) {
      // Chrome might have a built-in ad blocker or extension we couldn't identify
      // Try to differentiate: if adsbygoogle.js is blocked, might be DNS or extension
      const scriptBlocked = await testScriptBlock();
      if (!scriptBlocked) {
        // Script loaded but bait was hidden — likely Chrome's built-in ad blocker
        setDetected(true);
        setType('chrome-adblock');
        setChecking(false);
        return;
      }
      // Both bait and script blocked — likely DNS blocker or heavy extension
      setDetected(true);
      setType('dns-blocker');
      setChecking(false);
      return;
    }

    // Fallback
    setDetected(true);
    setType('unknown');
    setChecking(false);
  }, []);

  useEffect(() => {
    runDetection();
    const interval = setInterval(() => {
      if (detected || checkCount.current < 3) runDetection();
    }, 8000);
    const onFocus = () => setTimeout(runDetection, 500);
    const onVis = () => { if (document.visibilityState === 'visible') setTimeout(runDetection, 500); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(interval); window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onVis); };
  }, [runDetection, detected]);

  return { detected, type, browserName, checking, recheck: runDetection };
}

function runBaitTest(): Promise<boolean> {
  return new Promise((resolve) => {
    const baitNames = [
      'adsbox', 'ad-placement', 'ad-banner', 'ad-wrapper', 'ad-container',
      'ad-slot', 'advert', 'advertisement', 'textads', 'ad_leaderboard',
      'google-ad', 'adsterra', 'ad_unit', 'sponsored-content'
    ];
    const bait = document.createElement('div');
    bait.id = 'gvh-adbait';
    bait.innerHTML = '&nbsp;';
    bait.setAttribute('class', baitNames.join(' '));
    bait.setAttribute('style', 'position:absolute!important;top:-10px!important;left:-10px!important;width:1px!important;height:1px!important;overflow:hidden!important;pointer-events:none!important;');
    bait.setAttribute('data-ad', 'true');
    bait.setAttribute('data-ad-slot', 'test');
    bait.setAttribute('data-ad-client', 'ca-pub-test');
    document.body.appendChild(bait);

    setTimeout(() => {
      const el = document.getElementById('gvh-adbait');
      if (el) {
        const cs = window.getComputedStyle(el);
        const hidden = el.offsetHeight === 0 || el.offsetWidth === 0 || cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0' || el.parentElement === null;
        el.remove();
        resolve(hidden);
      } else {
        resolve(true);
      }
    }, 150);
  });
}

function testScriptBlock(): Promise<boolean> {
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    s.id = 'gvh-adscript';
    let done = false;
    const finish = (blocked: boolean) => { if (!done) { done = true; document.getElementById('gvh-adscript')?.remove(); resolve(blocked); } };
    s.onerror = () => finish(true);
    s.onload = () => finish(false);
    setTimeout(() => finish(true), 3000);
    try { document.head.appendChild(s); } catch { finish(true); }
  });
}
