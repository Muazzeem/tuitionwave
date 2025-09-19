import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const RoutineTable = () => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/routines/`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setRoutines(data.results || []);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching routines:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutines();
    }, []);

    const handleDownload = (pdfUrl, description) => {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `routine_${description.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-background rounded-2xl p-6 border-0 border-background-600 min-h-96">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-white">Recent Routine</h2>
                    <button className="px-3 py-1 rounded-full text-xs text-white bg-background-700 border border-background-500">
                        See All
                    </button>
                </div>
                <div className="flex items-center justify-center h-32">
                    <div className="text-white/60">Loading routines...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-background rounded-2xl p-6 border-0 border-background-600 min-h-96">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-white">Recent Routine</h2>
                    <button className="px-3 py-1 rounded-full text-xs text-white bg-background-700 border border-background-500">
                        See All
                    </button>
                </div>
                <div className="flex items-center justify-center h-32">
                    <div className="text-red-400">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background rounded-2xl p-6 border-0 border-background-600 min-h-48">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white">Recent Routine</h2>
                <button className="px-3 py-1 rounded-full text-xs text-white bg-background-700 border border-background-500">
                    See All
                </button>
            </div>

            {/* Routines List */}
            <div className="space-y-3">
                {routines.length === 0 ? (
                    <div className="rounded-xl text-center border border-slate-800 bg-background-600/40 p-6 text-slate-300 text-sm">
                        Not available for today.
                    </div>
                ) : (
                    routines.map((routine) => (
                        <div
                            key={routine.uid}
                            className="flex items-center justify-between gap-4 rounded-xl border border-background-600 bg-background-600/40 px-4 py-3"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-white font-medium truncate">
                                        {routine.description || 'Untitled Routine'}
                                    </p>
                                    {routine.is_active && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                                            Active
                                        </span>
                                    )}
                                </div>
                                <p className="text-white/60 text-sm mt-1">
                                    Created: {formatDate(routine.created_at)}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                                <Button
                                    onClick={() => handleDownload(routine.pdf_file_url, routine.description)}
                                    className="rounded-full px-5 h-9 bg-primary-500 hover:bg-primary-600 text-white transition-colors"
                                    disabled={!routine.pdf_file_url}
                                >
                                    Download
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RoutineTable;