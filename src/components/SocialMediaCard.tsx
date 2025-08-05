import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Globe, Users } from 'lucide-react';

const SocialMediaCards = () => {
    // Sample data - replace with your actual data
    const socialLinks = [
        {
            "id": 1,
            "type": "Facebook",
            "link": "http://localhost:8000/admin/social/sociallink/add/",
            "title": "BCS Preparation",
            "description": "23k followers",
            "cover_image": "http://127.0.0.1:8000/media/social_links/Screenshot_2025-08-04_at_11.29.35AM.png",
            "button_link": "http://localhost:8000/admin/social/sociallink/add/",
            "followers": "23k"
        },
        {
            "id": 2,
            "type": "Instagram",
            "link": "https://instagram.com/example",
            "title": "Study Group",
            "description": "15k followers",
            "cover_image": "",
            "button_link": "https://instagram.com/example",
            "followers": "15k"
        },
        {
            "id": 3,
            "type": "Twitter",
            "link": "https://twitter.com/example",
            "title": "News & Updates",
            "description": "8.5k followers",
            "cover_image": "",
            "button_link": "https://twitter.com/example",
            "followers": "8.5k"
        },
        {
            "id": 4,
            "type": "Youtube",
            "link": "https://youtube.com/example",
            "title": "Tutorial Channel",
            "description": "45k subscribers",
            "cover_image": "",
            "button_link": "https://youtube.com/example",
            "followers": "45k"
        }
    ];

    // Function to get the appropriate icon based on social media type
    const getSocialIcon = (type) => {
        const iconProps = { size: 16, className: "text-white" };

        switch (type.toLowerCase()) {
            case 'facebook':
                return <Facebook {...iconProps} />;
            case 'instagram':
                return <Instagram {...iconProps} />;
            case 'twitter':
                return <Twitter {...iconProps} />;
            case 'linkedin':
                return <Linkedin {...iconProps} />;
            case 'youtube':
                return <Youtube {...iconProps} />;
            default:
                return <Globe {...iconProps} />;
        }
    };

    // Function to get platform-specific colors for the badge
    const getPlatformColor = (type) => {
        switch (type.toLowerCase()) {
            case 'facebook':
                return 'bg-blue-600';
            case 'instagram':
                return 'bg-gradient-to-r from-purple-500 to-pink-500';
            case 'twitter':
                return 'bg-sky-500';
            case 'linkedin':
                return 'bg-blue-700';
            case 'youtube':
                return 'bg-red-600';
            default:
                return 'bg-gray-600';
        }
    };

    return (
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
                                <span className="text-white">Group</span>
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
                                Open
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialMediaCards;

