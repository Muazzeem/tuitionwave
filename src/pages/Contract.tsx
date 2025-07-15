import { useParams } from "react-router-dom";
import CreateContract from "@/components/CreateContract";
import { useState } from "react";

const Contract = () => {
    const { uid } = useParams(); 
    const [isOpen] = useState(true);

    if (!uid) {
        return <div>Invalid UID</div>;
    }

    return (
        <div className="w-full dark:bg-gray-900">
            <CreateContract 
                uid={uid}
                drawer={{ isOpen }}
            />
        </div>
    );
};

export default Contract;
