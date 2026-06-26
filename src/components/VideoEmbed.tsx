import { useState } from 'react';

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  // Direct ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  // youtube.com/watch?v=...
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  // youtu.be/...
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  // youtube.com/embed/...
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  return null;
}

export default function VideoEmbed({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const videoId = getYouTubeId(url);

  if (!videoId) return null;

  return (
    <div className="mt-4 rounded-xl overflow-hidden border dark:border-gray-700 border-gray-200">
      {loaded ? (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={() => setLoaded(true)}
          className="relative w-full flex items-center justify-center group"
          style={{ paddingBottom: '56.25%' }}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
          <span className="absolute bottom-3 left-3 text-xs text-white/80 font-medium bg-black/50 px-2 py-1 rounded">▶ Watch Tutorial</span>
        </button>
      )}
    </div>
  );
}
