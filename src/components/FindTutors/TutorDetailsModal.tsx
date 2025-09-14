
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tutor } from "@/types/tutor";

interface TutorDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    uid: string;
}

export default function TutorDetailsModal({
    isOpen,
    onClose,
    onConfirm,
    uid,
}: TutorDetailsModalProps) {
    const [tutorDetails, setTutorDetails] = useState<Tutor | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTutorDetails = async () => {
            if (!uid) return;

            if (tutorDetails && tutorDetails.uid === uid) return;

            setTutorDetails(null);
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutors/${uid}`);
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(
                        `HTTP error! status: ${response.status}, message: ${errorMessage}`
                    );
                }
                const data: Tutor = await response.json();
                setTutorDetails(data);
                console.log(data);
            } catch (e: any) {
                setError("Failed to load tutor details.");
                console.error("Error fetching tutor details:", e);
            } finally {
                setLoading(false);
            }
        };
        if (isOpen && uid) {
            fetchTutorDetails();
        } else {
            setTutorDetails(null);
            setError(null);
            setLoading(false);
        }
    }, [isOpen, uid]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {loading ? (
                <DialogContent className="max-w-xl sm:p-3 md:p-5 border-0 bg-gray-900 rounded-lg shadow-lg text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-white text-sm text-center">
                            <Loader2 className="h-5 w-5" />
                        </DialogTitle>
                    </DialogHeader>
                </DialogContent>
            ) : (
                <DialogContent className="max-w-xl sm:p-3 md:p-5 border-0 bg-gray-900 rounded-lg shadow-lg text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-white text-sm">
                            <Target className="h-5 w-5" />
                                {tutorDetails?.full_name}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="p-2 md:p-4 flex-grow overflow-y-auto">

                        </div>


                        <DialogFooter>
                            <Button variant="ghost" onClick={onClose} className='border-0 text-white
                        hover:bg-red-900 hover:text-white mt-2 md:mt-0'>
                                Cancel
                            </Button>
                            <Button onClick={onConfirm} className='text-white bg-blue-700 hover:bg-blue-900'>
                                Create Contract
                            </Button>
                        </DialogFooter>
                    </DialogContent>
            )}

        </Dialog>
    );
}
