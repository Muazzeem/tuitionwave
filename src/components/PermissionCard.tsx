import { ShieldX, RefreshCw, UserPlus } from "lucide-react";

interface ErrorPageProps {
    icon?: React.ElementType; // Lucide icon or custom icon
    iconClassName?: string;
    title: string;
    subtitle?: string;
    message: string;
    primaryAction?: {
        label: string;
        onClick: () => void;
        icon?: React.ElementType;
        className?: string;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
        icon?: React.ElementType;
        className?: string;
    };
    supportEmail?: string;
}

export default function ErrorPage({
    icon: Icon = ShieldX,
    iconClassName = "text-red-600 dark:text-red-400",
    title,
    subtitle,
    message,
    primaryAction,
    secondaryAction,
    supportEmail,
}: ErrorPageProps) {
    return (
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900 w-full">
            <div className="flex items-center justify-center pt-20">
                <div className="max-w-md w-full">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
                            <Icon className={`h-12 w-12 ${iconClassName}`} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            {title}
                        </h1>
                        {subtitle && (
                            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                                {subtitle}
                            </h2>
                        )}
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            {message}
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {primaryAction && (
                                <button
                                    onClick={primaryAction.onClick}
                                    className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${primaryAction.className}`}
                                >
                                    {primaryAction.icon && (
                                        <primaryAction.icon className="h-5 w-5" />
                                    )}
                                    {primaryAction.label}
                                </button>
                            )}

                            {secondaryAction && (
                                <button
                                    onClick={secondaryAction.onClick}
                                    className={`w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-200 flex items-center justify-center gap-2 ${secondaryAction.className}`}
                                >
                                    {secondaryAction.icon && (
                                        <secondaryAction.icon className="h-5 w-5" />
                                    )}
                                    {secondaryAction.label}
                                </button>
                            )}
                        </div>

                        {/* Help Text */}
                        {supportEmail && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
                                Need help? Contact support at{" "}
                                <a
                                    href={`mailto:${supportEmail}`}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    {supportEmail}
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
