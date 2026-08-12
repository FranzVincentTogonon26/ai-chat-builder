import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PRESENT_COLORS } from "@/constant";
import { cn } from "@/lib/utils";
import { Palette, Save } from "lucide-react";
import React from "react";

interface ApperanceConfigProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (msg: string) => void;
  handleSave: () => void;
  isSaving: boolean;
  hasChanges: boolean;
}

const ApperanceConfig = ({
  primaryColor,
  setPrimaryColor,
  welcomeMessage,
  setWelcomeMessage,
  handleSave,
  isSaving,
  hasChanges,
}: ApperanceConfigProps) => {
  return (
    <Card className="border-white/5 bg-[#0a0a0e]">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-zinc-500" />
          <CardTitle className="text-white text-sm font-medium uppercase tracking-wider">
            Appearance
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <Label className="text-zinc-300">Primary Color</Label>
          <div className="flex gap-3">
            {PRESENT_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => setPrimaryColor(color.value)}
                className={cn(
                  `w-6 h-6 rounded-full border-2 transition-all`,
                  primaryColor === color.value
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#0A0A0E] scale-100"
                    : "opacity-60 hover:opacity-100",
                )}
                style={{
                  backgroundColor: color.value,
                  borderColor: color.value,
                }}
                title={color.name}
              />
            ))}
            <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white/70 ml-1">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="absolute -top-2 -left-3 w-10 h-10 border-0 p-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-zinc-300">Welcome Message</Label>
          <Textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="Hi, How can I help you?"
            className="text-white bg-white/2 border-white/10 resize-none text-sm min-h-[80px]"
          />
        </div>
        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-white text-black hover:bg-zinc-200 animate-accordion-in h-9 font-semibold"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                {" "}
                <Save className="w-4 h-4 mr-2" /> Save Changes{" "}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ApperanceConfig;
