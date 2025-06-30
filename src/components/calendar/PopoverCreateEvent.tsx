import React, { useState } from "react";
import { addDays, format} from "date-fns";
import { CalendarIcon, Terminal, Plus } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "../common/timepicker/time-picker";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PopoverCreateEvent() {
    const [start, setStart] = useState<Date | undefined>(new Date());
    const [end, setEnd] = useState(start ? addDays(start, 1) : undefined);
    const [allDay, setAllDay] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        coachName: "",
        type: "workout"
    });

    const handleCheckboxChange = (checked: boolean) => {
        setAllDay(checked);
        if (checked) {
            setStart(undefined);
            setEnd(undefined);
            setShowAlert(false);
        }
    };

    const handleEndDateChange = (date: Date | undefined) => {
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
        console.log("Event saved:", { start, end, allDay, formData });
        // Close the dialog or perform other actions as needed
    };

    const eventTypes = [
        { value: "workout", label: "Entraînement" },
        { value: "training", label: "Formation" },
        { value: "cardio", label: "Cardio" },
        { value: "yoga", label: "Yoga" },
        { value: "strength", label: "Musculation" }
    ];

    return (
    <div className={cn("grid gap-2", "grid-cols-1")}>
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="size-4" />
                    Créer une session
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                <DialogTitle>Créer une nouvelle session</DialogTitle>
                <DialogDescription>
                    Créez une nouvelle session d&apos;entraînement ou d&apos;activité.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Nom
                        </Label>
                        <Input
                        id="name"
                        placeholder="Nom de la session"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                        Description
                        </Label>
                        <Textarea
                        id="description"
                        placeholder="Description de la session"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="col-span-3"
                        rows={3}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="coach" className="text-right">
                        Coach
                        </Label>
                        <Input
                        id="coach"
                        placeholder="Nom du coach"
                        value={formData.coachName}
                        onChange={(e) => setFormData(prev => ({ ...prev, coachName: e.target.value }))}
                        className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                        Type
                        </Label>
                        <select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="col-span-3"
                        >
                            {eventTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Checkbox id="allDay" onCheckedChange={handleCheckboxChange} />
                        <Label htmlFor="allDay" className="text-sm font-medium">
                            Événement journalier
                        </Label>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            {!allDay ? "Début" : "Date"}
                        </Label>
                        <div className="col-span-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !start && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 size-4" />
                                    {start ? (
                                    allDay ? (
                                        format(start, "PPP", { locale: fr })
                                    ) : (
                                        format(start, "PPP HH:mm", { locale: fr })
                                    )
                                    ) : (
                                    <span>Sélectionner une date</span>
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
                        <Label className="text-right">Fin</Label>
                        <div className="col-span-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !end && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 size-4" />
                                    {end ? (
                                        format(end, "PPP HH:mm", { locale: fr })
                                    ) : (
                                        <span>Sélectionner une date</span>
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
                        <Terminal className="size-4" />
                        <AlertTitle>Date de fin invalide</AlertTitle>
                        <AlertDescription>
                            La date de fin ne peut pas être antérieure à la date de début.
                        </AlertDescription>
                        </Alert>
                    )}
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSave} className="gap-2">
                        <Plus className="size-4" />
                        Créer la session
                    </Button>
                </DialogFooter>
                <div id="popover-container_2"></div>
            </DialogContent>
        </Dialog>
    </div>
    );
}
