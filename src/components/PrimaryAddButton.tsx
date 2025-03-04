import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import React from "react";

export function PrimaryAddButton({buttonTitle, onClick}: {
    buttonTitle: string,
    onClick?: () => void,
}) {
    return (
        <Button
            onClick={onClick}
            className="bg-primary hover:bg-primary-600 text-white"
        >
            <Plus className="h-4 w-4 mr-2"/>
            {buttonTitle}
        </Button>
    );
}
