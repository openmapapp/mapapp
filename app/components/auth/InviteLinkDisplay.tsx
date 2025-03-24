import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function InviteLinkDisplay({
  inviteLink,
}: {
  inviteLink: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2 items-center">
      {/* Non-editable Input */}
      <Input
        type="text"
        value={inviteLink}
        readOnly
        className="flex-1 bg-gray-100 text-gray-700 cursor-default"
      />

      {/* Copy Button */}
      <Button onClick={handleCopy} variant="outline">
        <Copy className="w-4 h-4 mr-1" />
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}
