import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const RoutineTable = () => {
    const data = [
        { id: "01", subject: "Bangla", date: "10 Sep-25", time: "09:00 PM" },
        { id: "02", subject: "English", date: "10 Sep-25", time: "09:00 PM" },
    ];

    return (
        <div className="bg-background rounded-2xl p-6 border-0 border-background-600">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white">Recent Routine</h2>
                <button className="px-3 py-1 rounded-full text-xs text-white bg-background-700 border border-background-500">
                    See All
                </button>
            </div>

            {/* Table */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-background-600 bg-background-600/40 px-4 py-3"
            >
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-white font-medium truncate">aaa</p>
                    </div>
                    
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <Link to=''>
                        <Button className="rounded-full px-5 h-9 bg-primary-500 hover:bg-primary-500 text-white">
                            Download
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RoutineTable;
