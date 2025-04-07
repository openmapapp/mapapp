"use client";

import { useState } from "react";
import { useSession } from "@/app/lib/auth-client";
import { generateInvite } from "@/actions/admin/generateInvite";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Info, Copy, Check, Link as LinkIcon } from "lucide-react";
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
import InviteLinkDisplay from "../../auth/InviteLinkDisplay";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Define prop types
interface AccessSettingsProps {
  newSettings: any;
  setNewSettings: (settings: any) => void;
  globalSettings: any;
  updating: boolean;
  handleSave: () => Promise<void>;
}

// Setting type definition
interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: "toggle" | "select";
  options?: { value: string; label: string }[];
}

export default function AccessSettings({
  newSettings,
  setNewSettings,
  globalSettings,
  updating,
  handleSave,
}: AccessSettingsProps) {
  const [inviteLink, setInviteLink] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { data: session } = useSession();

  // Definition of all settings
  const settingItems: SettingItem[] = [
    {
      id: "registrationMode",
      title: "Registration Mode",
      description:
        "Allow any visitor to register or require an invitation code for registration.",
      type: "select",
      options: [
        { value: "open", label: "Open Registration" },
        { value: "invite-only", label: "Invite Only" },
      ],
    },
    {
      id: "mapOpenToVisitors",
      title: "Viewing Map Open to Visitors",
      description:
        "Decide whether anyone with the URL can view the map or if visitors must have an account.",
      type: "toggle",
    },
    {
      id: "submitReportsOpen",
      title: "Report Submission Open to Visitors",
      description:
        "Decide whether visitors must have an account to submit reports. This is highly recommended.",
      type: "toggle",
    },
    {
      id: "votesOpenToVisitors",
      title: "Voting Open to Visitors",
      description: "Allow visitors without accounts to vote on reports.",
      type: "toggle",
    },
  ];

  if (!newSettings)
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading settings...</p>
      </div>
    );

  // Handle invite link generation
  const handleGenerateInvite = async () => {
    if (!session) {
      toast.error("You must be logged in to generate invite links");
      return;
    }

    setGenerating(true);
    try {
      const link = await generateInvite(session);
      setInviteLink(link);
      toast.success("Invite link generated successfully");
    } catch (error) {
      console.error("Error generating invite:", error);
      toast.error("Failed to generate invite link");
    } finally {
      setGenerating(false);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    if (!inviteLink) return;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  // Render individual setting
  const renderSetting = (setting: SettingItem) => {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-border/50 last:border-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Label htmlFor={setting.id} className="text-base font-medium">
              {setting.title}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    size={16}
                    className="text-muted-foreground cursor-help"
                  />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  {setting.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground md:hidden">
            {setting.description}
          </p>
        </div>

        {setting.type === "toggle" && (
          <Switch
            id={setting.id}
            checked={!!newSettings[setting.id]}
            onCheckedChange={(value) =>
              setNewSettings({ ...newSettings, [setting.id]: value })
            }
            disabled={updating}
          />
        )}

        {setting.type === "select" && setting.options && (
          <Select
            value={newSettings[setting.id]}
            onValueChange={(value) =>
              setNewSettings({ ...newSettings, [setting.id]: value })
            }
            disabled={updating}
          >
            <SelectTrigger className="w-36 md:w-48">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {setting.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-bold">Access Settings</h2>
        <p className="text-muted-foreground">
          Control who can access, view, and contribute to your map.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Permissions</CardTitle>
          <CardDescription>
            Configure access control for your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {settingItems.map((setting) => (
              <div key={setting.id} className="py-2">
                {renderSetting(setting)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {newSettings.registrationMode === "invite-only" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Invitation Management</CardTitle>
            <CardDescription>
              Generate invitation links for new users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Create invite links that allow users to register when
                invitation-only mode is active.
              </p>

              {inviteLink && (
                <div className="flex flex-col space-y-2">
                  <Label>Generated Link</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted p-2 rounded text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {inviteLink}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      className={cn(
                        "transition-colors",
                        copied &&
                          "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                      )}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerateInvite}
              disabled={generating}
              className="flex gap-2"
            >
              <LinkIcon size={16} />
              {generating ? "Generating..." : "Generate Invite Link"}
            </Button>
          </CardFooter>
        </Card>
      )}

      <Button
        onClick={handleSave}
        className="w-full sm:w-auto"
        size="lg"
        disabled={updating}
      >
        {updating ? "Saving Changes..." : "Save Access Settings"}
      </Button>
    </div>
  );
}
