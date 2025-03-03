import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {PrimaryAddButton} from "@/components/PrimaryAddButton";

export const ToolModal = ({submitTool}: {
    submitTool: () => void
}) => {
    const [newTool, setNewTool] = useState({name: '', link: ''});
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <PrimaryAddButton buttonTitle="Add Tool" onClick={() => setOpen(true)}></PrimaryAddButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Tool</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="tool-name">Tool Name</Label>
                        <Input
                            id="tool-name"
                            placeholder="Enter tool name"
                            value={newTool.name}
                            onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tool-link">Purchase Link (optional)</Label>
                        <Input
                            id="tool-link"
                            placeholder="https://example.com/tool"
                            value={newTool.link}
                            onChange={(e) => setNewTool({...newTool, link: e.target.value})}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={submitTool}>Add Tool</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}