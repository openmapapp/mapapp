import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useData } from "@/context/DataProvider";
import { toast } from "sonner";

export default function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshReports } = useData();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshReports();
      toast.success("Map data refreshed", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh map data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-md hover:bg-background"
      onClick={handleRefresh}
      disabled={isRefreshing}
      title="Refresh Map Data"
    >
      <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
    </Button>
  );
}
