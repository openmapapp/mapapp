import { useState } from "react";
import { useSession } from "@/app/lib/auth-client";
import { generateInvite } from "@/actions/generateInvite";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import InviteLinkDisplay from "../auth/InviteLinkDisplay";

export default function AccessSettings({
  newSettings,
  setNewSettings,
  globalSettings,
  updating,
  handleSave,
}) {
  const [inviteLink, setInviteLink] = useState("");
  const { data: session } = useSession();
  if (!newSettings) return <p>Loading settings...</p>;

  const handleGenerateInvite = async () => {
    const link = await generateInvite(session);
    setInviteLink(link);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Access Settings</h2>
      <div className="flex flex-col w-full gap-4 mt-5">
        <TooltipProvider>
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              <label className="font-semibold">Registration Mode</label>
              <Tooltip>
                <TooltipTrigger className="flex gap-1">
                  <Info size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Allow any visitor to register or require an invitation code
                    for registration.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="">
              <Select
                defaultValue={newSettings.registrationMode}
                onValueChange={(value) =>
                  setNewSettings({
                    ...newSettings,
                    registrationMode: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={newSettings.registrationMode} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="invite-only">Invite Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {globalSettings.registrationMode === "invite-only" && (
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                <label className="font-semibold">Invite Link</label>
                <Tooltip>
                  <TooltipTrigger className="flex gap-1">
                    <Info size={16} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Generate an invite link that can be shared with others to
                      register.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Button className="w-22" onClick={handleGenerateInvite}>
                  Generate
                </Button>
                <InviteLinkDisplay inviteLink={inviteLink} />
              </div>
            </div>
          )}
          <div className="flex justify-between">
            <div className="flex gap-1">
              <label className="font-semibold">
                Viewing Map Open to Visitors
              </label>
              <Tooltip>
                <TooltipTrigger className="flex gap-1">
                  <Info size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Decide whether anyone with the URL can view the map or if
                    visitors must have an account.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              checked={newSettings.mapOpenToVisitors}
              onCheckedChange={(value) =>
                setNewSettings({ ...newSettings, mapOpenToVisitors: value })
              }
            />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1">
              <label className="font-semibold">
                Report Submission Open to Visitors
              </label>
              <Tooltip>
                <TooltipTrigger className="flex gap-1">
                  <Info size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Decide whether visitors must have an account to submit
                    reports. This is highly recommended.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              checked={newSettings.submitReportsOpen}
              onCheckedChange={(value) =>
                setNewSettings({ ...newSettings, submitReportsOpen: value })
              }
            />
          </div>

          <Button onClick={handleSave} className="mt-4" disabled={updating}>
            {updating ? "Saving..." : "Save Changes"}
          </Button>
        </TooltipProvider>
      </div>
    </div>
  );
}
