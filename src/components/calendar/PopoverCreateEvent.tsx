import React, { useState } from "react";
import { addDays, format} from "date-fns";
import { CalendarIcon, Terminal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover_SheetEventCard";
import { fr } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimePicker } from "../common/timepicker/time-picker";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PopoverCreateEvent() {
    const [start, setStart] = useState<Date | undefined>(new Date());
    //we setup end date to be 1 day after start date and we verify if date is set. If date is set we put it in the end date
    const [end, setEnd] = useState(start ? addDays(start, 1) : undefined);
    const [allDay, setAllDay] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const handleCheckboxChange = (checked: boolean) => {
        setAllDay(checked);
        if (checked) {
            setStart(undefined);
            setEnd(undefined);
            setShowAlert(false);
        }
    };

    const handleEndDateChange = (date: Date | undefined) => {
        console.log("date", date);
        console.log("start", start);
        if (date && start && date.getTime() >= start.getTime()) {
            setEnd(date);
            setShowAlert(false);
        } else {
            setShowAlert(true);
        }
    };

    const handleSave = () => {
        if (!start || !end || (end && start && end.getTime() < start.getTime())) {
          setShowAlert(true);
          return;
        }
    
        // Perform save action here
        console.log("Event saved:", { start, end, allDay });
        // Close the dialog or perform other actions as needed
      };
    return (
    <div className={cn("grid gap-2", "grid-cols-1")}>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Créer une session 🚀</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Créer une session 🚀</DialogTitle>
                <DialogDescription>
                    Make changes to your profile here. Click save when you&apos;re done.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Name Session
                        </Label>
                        <Input
                        id="name"
                        defaultValue="Pedro Duarte"
                        className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                        Description
                        </Label>
                        <Input
                        id="username"
                        defaultValue="Describe your session"
                        className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                        Coach Name
                        </Label>
                        <Input
                        id="username"
                        defaultValue="@peduarte"
                        className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-1 items-center justify-items-center gap-4">
                        <div className="my-2 flex items-center space-x-2">
                        <Label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Evenement journalier
                        </Label>
                        <Checkbox id="terms" onCheckedChange={handleCheckboxChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        {!allDay ? (
                        <Label className="text-right">Start</Label>
                        ) : (
                        <Label className="text-right">Date</Label>
                        )}
                        <div className="my-1 grid items-center">
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "justify-start text-left font-normal",
                                    !start && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {start ? (
                                    allDay ? (
                                        format(start, "PPP", { locale: fr })
                                    ) : (
                                        format(start, "PPP HH':'mm", { locale: fr })
                                    )
                                    ) : (
                                    <span>Pick a date</span>
                                    )}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                className="z-[1050] w-auto p-0"
                                side="right"
                                align="start"
                                containerId="popover-container_2"
                                >
                                <Calendar
                                    mode="single"
                                    selected={start}
                                    onSelect={setStart}
                                    locale={fr}
                                    initialFocus
                                />
                                {/* TimePicker only if allDay = false*/}
                                {!allDay && (
                                    <div className="border-t border-border p-3">
                                    <TimePicker setDate={setStart} date={start} />
                                    </div>
                                )}
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {!allDay && (
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">End</Label>
                        <div className="my-1 grid items-center">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !end && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon />
                                    {end ? (
                                        format(end, "PPP HH':'mm", { locale: fr })
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="z-[1050] w-auto p-0"
                                    align="center"
                                    side="right"
                                    containerId="popover-container_2"
                                >
                                    <Calendar
                                    mode="single"
                                    selected={end}
                                    onSelect={handleEndDateChange}
                                    locale={fr}
                                    initialFocus
                                    />
                                    {/* TimePicker only if allDay = false*/}
                                    <div className="border-t border-border p-3">
                                        <TimePicker setDate={handleEndDateChange} date={end} />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        </div>
                    )}
                    {showAlert && (
                        <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>
                            End date cannot be earlier than start date !
                        </AlertTitle>
                        <AlertDescription>
                            Please select a date and time that is later than the start
                            date.
                        </AlertDescription>
                        </Alert>
                    )}
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSave}>Save</Button>
                </DialogFooter>
                <div id="popover-container_2"></div>
            </DialogContent>
        </Dialog>
    </div>
    );
}
