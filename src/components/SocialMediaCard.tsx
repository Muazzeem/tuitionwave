import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SocialMediaCards = () => {
    const [socialLinks, setSocialLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from API
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/public/social-links/`)
            .then((res) => res.json())
            .then((data) => {
                setSocialLinks(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching social links:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="rounded-2xl bg-background-900 p-4 min-h-48">
            <h2 className="text-md font-bold text-white mb-2">
                Follow Us On Social Media
            </h2>

            <div className="space-y-3">
                {loading ? (
                    // Skeleton Loader
                    [...Array(3)].map((_, idx) => (
                        <div
                            key={idx}
                            className="flex items-center rounded-lg bg-background-700 p-0 overflow-hidden"
                        >
                            {/* Logo block */}
                            <Skeleton className="w-24 h-20 rounded-l-lg bg-slate-700/60" />

                            {/* Middle content */}
                            <div className="flex-1 px-4 py-3 space-y-2">
                                <Skeleton className="h-4 w-2/3 bg-slate-700/60" />
                                <Skeleton className="h-3 w-4/5 bg-slate-700/60" />
                            </div>

                            {/* Button */}
                            <div className="pr-4 hidden sm:block">
                                <Skeleton className="h-7 w-16 rounded-xl bg-slate-700/60" />
                            </div>
                        </div>
                    ))
                ) : (
                    socialLinks.map((social) => (
                        <a
                            key={social.id}
                            href={social.button_link || social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center rounded-lg bg-background-700 hover:bg-background-600 transition-colors duration-200"
                        >
                            {/* Logo / Image */}
                            <div className="w-24 h-20 flex-shrink-0 bg-white flex items-center justify-center overflow-hidden rounded-l-lg">
                                {social.cover_image ? (
                                    <img
                                        src={social.cover_image}
                                        alt={social.title}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm">No Logo</span>
                                )}
                            </div>

                            {/* Middle content */}
                            <div className="flex-1 px-4 py-3">
                                <h3 className="text-white font-medium text-sm mb-1 truncate">
                                    {social.title}
                                </h3>
                                <div className="flex items-center text-slate-300 text-xs">
                                    <Users size={14} className="mr-1 hidden sm:block" />
                                    <span>
                                        {social.description ||
                                            `Public group ${social.followers} members followers`}
                                    </span>
                                </div>
                            </div>

                            <div className="pr-4 hidden sm:block">
                                <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded-xl hover:bg-blue-700">
                                    {social.button_text || 'Follow'}
                                </button>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
};

export default SocialMediaCards;
