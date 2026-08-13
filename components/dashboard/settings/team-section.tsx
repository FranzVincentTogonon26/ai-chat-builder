import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { cn } from "@/lib/utils";
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

  const fetchTeam = async () => {
    try {
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
    void Promise.resolve().then(fetchTeam);
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
        setIsLoading(true);
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
          <DialogTrigger
            render={
              <Button
                size="sm"
                className="bg-white text-black hover:bg-zinc-200 h-8"
              />
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
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
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4 text-zinc-500 text-sm">
              Loading team..
            </div>
          ) : team.length > 0 ? (
            <div className="grid gap-4">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/1 hover:bg-white/2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-white/10">
                      <AvatarFallback className="bg-zinc-800 text-zinc-400">
                        {member.name?.slice(0, 2).toUpperCase() || "UN"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">
                          {member.name || "Unknown User"}
                        </p>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "capitalize border mx-1 mb-1",
                            member.status === "active"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500",
                          )}
                        >
                          {member.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {member.user_email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-white/5 capitalize text-zinc-400"
                    >
                      {member.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-zinc-500 text-sm">
              No team members found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamSection;
