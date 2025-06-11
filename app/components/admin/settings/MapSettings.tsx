"use client";

import { useState, useEffect, useCallback } from "react";
import { Map } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Define types for better type safety
interface MapSettingsProps {
  globalSettings: any; // Use the GlobalSettings type from your app
  newSettings: any;
  setNewSettings: (settings: any) => void;
  handleSave: () => Promise<void>;
}

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  mapZoom?: number;
  mapZoomMax?: number;
  mapZoomMin?: number;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export default function MapSettings({
  globalSettings,
  newSettings,
  setNewSettings,
  handleSave,
}: MapSettingsProps) {
  // State for map view
  const [viewState, setViewState] = useState<ViewState>({
    longitude: globalSettings.mapCenterLng || -73.935242,
    latitude: globalSettings.mapCenterLat || 40.73061,
    zoom: globalSettings.mapZoom || 13,
    mapZoom: globalSettings.mapZoom || "",
    mapZoomMax: globalSettings.mapZoomMax || 18,
    mapZoomMin: globalSettings.mapZoomMin || 10,
  });

  // State for map bounds
  const [bounds, setBounds] = useState<MapBounds>({
    north: globalSettings.mapBoundsNeLat || 40.900571,
    south: globalSettings.mapBoundsSwLat || 40.565883,
    east: globalSettings.mapBoundsNeLng || -73.65668,
    west: globalSettings.mapBoundsSwLng || -74.414162,
  });

  // State for map style
  const [mapStyle, setMapStyle] = useState<string>(
    globalSettings.mapStyle || ""
  );

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("preview");

  // Sync with global settings when they change
  useEffect(() => {
    setNewSettings(globalSettings);
  }, [globalSettings, setNewSettings]);

  // Handle map movement
  const handleMapMove = useCallback(
    ({ viewState, target }: any) => {
      setViewState(viewState);

      if (target && target.getBounds) {
        const mapBounds = target.getBounds();
        setBounds({
          north: mapBounds.getNorth(),
          south: mapBounds.getSouth(),
          east: mapBounds.getEast(),
          west: mapBounds.getWest(),
        });

        // Update pending settings but do not yet save to database
        setNewSettings((prev: any) => ({
          ...prev,
          mapCenterLat: viewState.latitude,
          mapCenterLng: viewState.longitude,
          mapBoundsNeLat: mapBounds.getNorth(),
          mapBoundsSwLat: mapBounds.getSouth(),
          mapBoundsNeLng: mapBounds.getEast(),
          mapBoundsSwLng: mapBounds.getWest(),
        }));
      }
    },
    [setNewSettings]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-bold">Map Settings</h2>
        <p className="text-muted-foreground">
          Configure how the map looks and behaves for all users.
        </p>
      </div>

      {/* Mobile-friendly tabs interface */}
      <Tabs
        defaultValue="preview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Map Preview</TabsTrigger>
          <TabsTrigger value="current">Current Settings</TabsTrigger>
        </TabsList>

        {/* Map preview tab */}
        <TabsContent value="preview" className="pt-4">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Map URL Source</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  placeholder="Enter custom Map URL"
                  value={mapStyle}
                  onChange={(e) => {
                    setMapStyle(e.target.value);
                    setNewSettings((prev: any) => ({
                      ...prev,
                      mapStyle: e.target.value,
                    }));
                  }}
                />
              </CardContent>
            </Card>

            {/* Map Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Map Position</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Center Latitude
                    </label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={viewState.latitude}
                      onChange={(e) =>
                        setViewState({
                          ...viewState,
                          latitude: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Center Longitude
                    </label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={viewState.longitude}
                      onChange={(e) =>
                        setViewState({
                          ...viewState,
                          longitude: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Zoom</label>
                    <Input
                      type="number"
                      step="1"
                      value={newSettings.mapZoom}
                      onChange={(e) =>
                        setNewSettings({
                          ...newSettings,
                          mapZoom: parseInt(e.target.value) || 13,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Min Zoom</label>
                      <Input
                        type="number"
                        step="1"
                        value={newSettings.mapZoomMin}
                        onChange={(e) =>
                          setNewSettings({
                            ...newSettings,
                            mapZoomMin: parseInt(e.target.value) || 10,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Max Zoom</label>
                      <Input
                        type="number"
                        step="1"
                        value={newSettings.mapZoomMax}
                        onChange={(e) =>
                          setNewSettings({
                            ...newSettings,
                            mapZoomMax: parseInt(e.target.value) || 18,
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Map Boundaries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Northeast Corner
                    </label>
                    <div className="p-2 bg-muted rounded text-sm">
                      {bounds.north && bounds.east
                        ? `${bounds.north.toFixed(4)}, ${bounds.east.toFixed(
                            4
                          )}`
                        : "Move the map to update"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Southwest Corner
                    </label>
                    <div className="p-2 bg-muted rounded text-sm">
                      {bounds.south && bounds.west
                        ? `${bounds.south.toFixed(4)}, ${bounds.west.toFixed(
                            4
                          )}`
                        : "Move the map to update"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Zoom</label>
                    <div className="p-2 bg-muted rounded text-sm">
                      {viewState.zoom.toFixed(1)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Preview */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>Interactive Map Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px] sm:h-[400px] w-full">
                  <Map
                    {...viewState}
                    onMove={handleMapMove}
                    style={{ width: "100%", height: "100%" }}
                    mapStyle={
                      mapStyle ||
                      `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
                    }
                  >
                    <Marker
                      latitude={viewState.latitude}
                      longitude={viewState.longitude}
                    />
                  </Map>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Current Settings Tab */}
        <TabsContent value="current" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Currently Saved Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These values reflect the current settings stored in the
                database. They will not update until you save your changes.
              </p>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="font-medium">Center Latitude</span>
                  <span>
                    {globalSettings.mapCenterLat?.toFixed(4) || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="font-medium">Center Longitude</span>
                  <span>
                    {globalSettings.mapCenterLng?.toFixed(4) || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="font-medium">Northeast Boundary</span>
                  <span>{`${
                    globalSettings.mapBoundsNeLat?.toFixed(4) || "N/A"
                  }, ${
                    globalSettings.mapBoundsNeLng?.toFixed(4) || "N/A"
                  }`}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="font-medium">Southwest Boundary</span>
                  <span>{`${
                    globalSettings.mapBoundsSwLat?.toFixed(4) || "N/A"
                  }, ${
                    globalSettings.mapBoundsSwLng?.toFixed(4) || "N/A"
                  }`}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="font-medium">Default Zoom</span>
                  <span>{globalSettings.mapZoom || "N/A"}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="font-medium">Min Zoom</span>
                  <span>{globalSettings.mapZoomMin || "N/A"}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="font-medium">Max Zoom</span>
                  <span>{globalSettings.mapZoomMax || "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} className="w-full sm:w-auto" size="lg">
        Save Map Settings
      </Button>
    </div>
  );
}
