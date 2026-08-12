import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TeamSection = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/team/fetch");
      if (res.ok) {
        const data = await res.json();
        setTeam(data.team);
      }
    } catch (error) {
      console.error("Team member fetching error:", error);
      toast.error("Team member fetching error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async () => {
    if (!newMemberEmail) return;

    try {
      setIsAdding(true);
      const response = await fetch("/api/team/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newMemberEmail,
          name: newMemberName,
        }),
      });

      if (response.ok) {
        setNewMemberEmail("");
        setNewMemberName("");
        setOpenDialog(false);
        fetchTeam();
      }
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error("Failed to add member");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="border border-white/5 bg-[#0a0a0e]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium text-white">
            Team Members
          </CardTitle>
          <CardDescription>Manage your team and their access.</CardDescription>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0e0e12] border border-white/10 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Add a new member to your organization. They will added
                immediately
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-zinc-300">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="john.doe@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white"
                />
              </div>

              <DialogFooter className="bg-[#0e0e12] border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  className=" border-white/10 text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMember}
                  disabled={isAdding}
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  {isAdding ? "Adding..." : "Add Member"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
    </Card>
  );
};

export default TeamSection;
