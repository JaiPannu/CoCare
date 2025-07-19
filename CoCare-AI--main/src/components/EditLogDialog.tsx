import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { VoiceRecorder } from "./VoiceRecorder";
import { Separator } from "@/components/ui/separator";

interface LogData {
  id: number;
  child: string;
  activityType: string;
  timeStart: string;
  timeEnd: string;
  outcome: "positive" | "negative" | "neutral";
  description: string;
  aiSuggestion?: string;
  status?: string;
}

interface EditLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: LogData | null;
  onSave: (log: LogData) => void;
}

const activityTypes = [
  "Physical Activity",
  "Educational",
  "Social Interaction", 
  "Creative Arts",
  "Music Therapy",
  "Meal Time",
  "Rest/Sleep",
  "Behavior Management",
  "Medical Care",
  "Free Play"
];

export function EditLogDialog({ open, onOpenChange, log, onSave }: EditLogDialogProps) {
  const [formData, setFormData] = useState<LogData>({
    id: log?.id || 0,
    child: log?.child || "",
    activityType: log?.activityType || "",
    timeStart: log?.timeStart || "",
    timeEnd: log?.timeEnd || "",
    outcome: log?.outcome || "neutral",
    description: log?.description || "",
    aiSuggestion: log?.aiSuggestion || "",
    status: log?.status || "pending"
  });

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const getOutcomeBadgeVariant = (outcome: string) => {
    switch (outcome) {
      case "positive": return "default";
      case "negative": return "destructive";
      case "neutral": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Care Log</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Child Name */}
          <div className="grid gap-2">
            <Label htmlFor="child">Child Name</Label>
            <Input
              id="child"
              value={formData.child}
              onChange={(e) => setFormData({ ...formData, child: e.target.value })}
              placeholder="Enter child's name"
            />
          </div>

          {/* Activity Type */}
          <div className="grid gap-2">
            <Label htmlFor="activityType">Activity Type</Label>
            <Select
              value={formData.activityType}
              onValueChange={(value) => setFormData({ ...formData, activityType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="timeStart">Start Time</Label>
              <Input
                id="timeStart"
                type="time"
                value={formData.timeStart}
                onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timeEnd">End Time</Label>
              <Input
                id="timeEnd"
                type="time"
                value={formData.timeEnd}
                onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
              />
            </div>
          </div>

          {/* Outcome */}
          <div className="grid gap-2">
            <Label htmlFor="outcome">Outcome</Label>
            <Select
              value={formData.outcome}
              onValueChange={(value: "positive" | "negative" | "neutral") => 
                setFormData({ ...formData, outcome: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="w-2 h-2 p-0 bg-green-500"></Badge>
                    Positive
                  </div>
                </SelectItem>
                <SelectItem value="neutral">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="w-2 h-2 p-0"></Badge>
                    Neutral
                  </div>
                </SelectItem>
                <SelectItem value="negative">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="w-2 h-2 p-0"></Badge>
                    Negative
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Type your description here..."
            />
            
            <div className="flex items-center gap-2 mt-2">
              <VoiceRecorder
                onTranscription={(text) => {
                  const currentDescription = formData.description;
                  const newDescription = currentDescription 
                    ? `${currentDescription} ${text}` 
                    : text;
                  setFormData({ ...formData, description: newDescription });
                }}
                placeholder="Record voice notes to add to description..."
              />
            </div>
          </div>

          {/* Preview Summary */}
          <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-medium mb-2">Log Summary:</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Child:</span> {formData.child || "Not specified"}</p>
              <p><span className="font-medium">Activity:</span> {formData.activityType || "Not specified"}</p>
              <p><span className="font-medium">Duration:</span> {formData.timeStart && formData.timeEnd ? `${formData.timeStart} - ${formData.timeEnd}` : "Not specified"}</p>
              <div className="flex items-center gap-2">
                <span className="font-medium">Outcome:</span>
                <Badge variant={getOutcomeBadgeVariant(formData.outcome)}>
                  {formData.outcome}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}