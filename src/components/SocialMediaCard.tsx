import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Globe, Users } from 'lucide-react';

const SocialMediaCards = () => {
    const [socialLinks, setSocialLinks] = useState([]);
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

    const getSocialIcon = (type) => {
        const iconProps = { size: 16, className: "text-white" };
        switch (type?.toLowerCase()) {
            case 'facebook': return <Facebook {...iconProps} />;
            case 'instagram': return <Instagram {...iconProps} />;
            case 'twitter': return <Twitter {...iconProps} />;
            case 'linkedin': return <Linkedin {...iconProps} />;
            case 'youtube': return <Youtube {...iconProps} />;
            case 'page': return <Facebook {...iconProps} />;
            default: return <Globe {...iconProps} />;
        }
    };

    const getPlatformColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'facebook': return 'bg-blue-600';
            case 'page': return 'bg-blue-600';
            case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
            case 'twitter': return 'bg-sky-500';
            case 'linkedin': return 'bg-blue-700';
            case 'youtube': return 'bg-red-600';
            default: return 'bg-gray-600';
        }
    };

    return (
        <div className="z-10">
            <div className="w-full mx-auto pt-8">
                <h2 className="text-xl font-bold text-white mb-2">Follow Us On Social Media</h2>

                <div className="flex gap-4 overflow-x-auto pb-4">
                    {socialLinks.map((social) => (
                        <div
                            key={social.id}
                            className="bg-background rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-shrink-0 w-64"
                        >
                            {/* Cover Image Section */}
                            <div className="relative h-24 bg-gradient-to-br from-slate-600 to-slate-700">
                                {social.cover_image ? (
                                    <img
                                        src={social.cover_image}
                                        alt={social.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : null}

                                <div className={`
                                    w-full h-full absolute inset-0 flex items-center justify-center
                                    ${social.cover_image ? 'hidden' : 'flex'}
                                    bg-gradient-to-br from-slate-600 to-slate-700
                                `}>
                                    <div className="text-slate-300 opacity-50">
                                        {getSocialIcon(social.type)}
                                    </div>
                                </div>

                                {/* Platform Badge */}
                                <div className={`
                                    absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1
                                    ${getPlatformColor(social.type)}
                                `}>
                                    {getSocialIcon(social.type)}
                                    <span className="text-white">{social.type}</span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-3">
                                <h3 className="text-white font-medium text-sm mb-1 truncate">
                                    {social.title}
                                </h3>

                                <div className="flex items-center text-slate-400 text-xs mb-3">
                                    <Users size={12} className="mr-1" />
                                    <span>{social.followers || social.description} followers</span>
                                </div>

                                <a
                                    href={social.button_link || social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-primary hover:bg-primary-700 text-white font-medium py-1.5 px-3 rounded-md transition-colors duration-200 text-center block text-sm"
                                >
                                    {social.button_text || 'Open'}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialMediaCards;
