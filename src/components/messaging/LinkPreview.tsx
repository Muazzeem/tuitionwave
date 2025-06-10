
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
  className?: string;
}

interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url, className = '' }) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchLinkMetadata(url);
  }, [url]);

  const fetchLinkMetadata = async (url: string) => {
    try {
      setLoading(true);
      setError(false);

      // Using a CORS proxy to fetch metadata
      // const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      // const response = await fetch(proxyUrl);
      // const data = await response.json();
      const data = null;
      
      if (data.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        const title = 
          doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
          doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
          doc.querySelector('title')?.textContent ||
          url;

        const description = 
          doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
          doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
          doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
          '';

        const image = 
          doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
          doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
          '';

        setMetadata({
          title: title.trim(),
          description: description.trim(),
          image: image,
          url: url
        });
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching link metadata:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <Card className={`mt-2 cursor-pointer hover:bg-gray-50 ${className}`}>
        <CardContent className="p-3">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !metadata) {
    return (
      <Card className={`mt-2 cursor-pointer hover:bg-gray-50 ${className}`} onClick={handleLinkClick}>
        <CardContent className="p-3">
          <div className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-blue-600 truncate">{url}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`mt-2 cursor-pointer hover:bg-gray-50 ${className}`} onClick={handleLinkClick}>
      <CardContent className="p-3">
        <div className="flex">
          {metadata.image && (
            <div className="w-16 h-16 mr-3 flex-shrink-0">
              <img
                src={metadata.image}
                alt={metadata.title}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
              {metadata.title}
            </h4>
            {metadata.description && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                {metadata.description}
              </p>
            )}
            <div className="flex items-center">
              <ExternalLink className="h-3 w-3 mr-1 text-gray-400" />
              <span className="text-xs text-gray-500 truncate">
                {new URL(url).hostname}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkPreview;
