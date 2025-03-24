import { useState, useEffect, useCallback } from "react";
import { Map } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function MapSettings({
  globalSettings,
  newSettings,
  setNewSettings,
  handleSave,
}) {
  // Holds admin's pending changes before submitting
  const [viewState, setViewState] = useState({
    longitude: globalSettings.mapCenterLng || -73.935242, // Default values
    latitude: globalSettings.mapCenterLat || 40.73061,
    zoom: globalSettings.mapZoom || 13,
    mapZoom: globalSettings.mapZoom || "",
    mapZoomMax: globalSettings.mapZoomMax || 18,
    mapZoomMin: globalSettings.mapZoomMin || 10,
  });
  const [bounds, setBounds] = useState({
    north: 40.900571,
    south: 40.565883,
    east: -73.65668,
    west: -74.414162,
  });

  // Holds current settings from the database and updates only after submitting
  const [mapStyle, setMapStyle] = useState(""); // Fetch from settings initially

  //   const handleUpdate = async () => {
  //     await updateGlobalSetting({ mapStyle });
  //     toast.success("Map style updated!");
  //   };

  useEffect(() => {
    setNewSettings(globalSettings);
  }, [globalSettings]);

  const handleMapMove = useCallback(({ viewState, target }) => {
    setViewState(viewState);

    if (target && target.getBounds) {
      const mapBounds = target.getBounds();
      setBounds({
        north: mapBounds.getNorth(),
        south: mapBounds.getSouth(),
        east: mapBounds.getEast(),
        west: mapBounds.getWest(),
      });

      //Updates pending settings but does not yet save to database
      setNewSettings((prev) => ({
        ...prev,
        mapCenterLat: viewState.latitude,
        mapCenterLng: viewState.longitude,
        mapBoundsNeLat: mapBounds.getNorth(),
        mapBoundsSwLat: mapBounds.getSouth(),
        mapBoundsNeLng: mapBounds.getEast(),
        mapBoundsSwLng: mapBounds.getWest(),
      }));
    }
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Map Settings</h2>
      <div className="flex gap-8">
        {/* Left Side: Interactive Map + Inputs */}
        <div className="flex flex-col w-[50%] space-y-4">
          <h3>Pending Settings</h3>
          <p className="text-sm text-gray-600">
            <strong>Make adjustments to the map below.</strong> Changes are not
            saved until you click <i>Update</i>. All settings will update to
            reflect the current map view below, with the exception of Default
            Zoom, Max Zoom, and Min Zoom, which much all be manually adjusted.
          </p>
          <label>API Map Source</label>
          <Input
            type="text"
            placeholder="Enter custom Map URL"
            value={mapStyle}
            onChange={(e) => {
              setMapStyle(e.target.value);
              setNewSettings((prev) => ({
                ...prev,
                mapStyle: e.target.value,
              }));
            }}
          />
          <div className="flex gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Map Center Latitude</label>
              <Input
                type="number"
                step="0.0001"
                value={viewState.latitude}
                onChange={(e) =>
                  setViewState({
                    ...viewState,
                    latitude: parseFloat(e.target.value),
                  })
                }
              />
              <div className="">
                <label className="font-semibold">Map Center Longitude</label>
                <Input
                  type="number"
                  step="0,0001"
                  value={viewState.longitude}
                  onChange={(e) =>
                    setViewState({
                      ...viewState,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="">
                <label className="font-semibold">Default Zoom</label>
                <Input
                  type="number"
                  step="1"
                  value={newSettings.mapZoom}
                  onChange={(e) =>
                    setNewSettings({
                      ...newSettings,
                      mapZoom: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="">
                <label className="font-semibold">Max Zoom</label>
                <Input
                  type="number"
                  step="1"
                  value={newSettings.mapZoomMax}
                  onChange={(e) =>
                    setNewSettings({
                      ...newSettings,
                      mapZoomMax: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="">
                <label className="font-semibold">Min Zoom</label>
                <Input
                  type="number"
                  step="1"
                  value={newSettings.mapZoomMin}
                  onChange={(e) =>
                    setNewSettings({
                      ...newSettings,
                      mapZoomMin: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="">
                <label className="font-semibold">Northeast Boundary</label>

                <p>
                  {bounds.north && bounds.east
                    ? `${bounds.north.toFixed(4)}, ${bounds.east.toFixed(4)}`
                    : "Move the map to update"}
                </p>
              </div>
              <div className="">
                <label className="font-semibold">Southwest Boundary</label>
                <p>
                  {bounds.south && bounds.west
                    ? `${bounds.south.toFixed(4)}, ${bounds.west.toFixed(4)}`
                    : "Move the map to update"}
                </p>
              </div>
              <div className="">
                <label className="font-semibold">Map Zoom</label>
                <p>{viewState.zoom.toFixed(0)}</p>
              </div>
            </div>
          </div>
          <div className="h-96 border border-gray-300 rounded-md">
            <Map
              {...viewState}
              onMove={handleMapMove}
              style={{ width: "100%", height: "400px" }}
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
        </div>
        <div className="px-10 flex flex-col items-center w-[50%] gap-4">
          <h3>Saved Settings</h3>
          <p className="text-sm text-gray-600">
            These values are the current settings stored in the database. They
            will not update until you press <i>Update</i>.
          </p>
          <div className="flex flex-col min-h-32 w-full outline p-4 gap-4">
            <div className="flex justify-between">
              <h4>Center Latitude</h4>
              <p>{globalSettings.mapCenterLat?.toFixed(4) || "N/A"}</p>{" "}
            </div>
            <div className="flex justify-between">
              <h4>Center Longitude</h4>
              <p>{globalSettings.mapCenterLng?.toFixed(4) || "N/A"}</p>{" "}
            </div>
            <div className="flex justify-between">
              <h4>Northeast Boundary</h4>
              <p>{`${globalSettings.mapBoundsNeLat?.toFixed(4) || "N/A"}, ${
                globalSettings.mapBoundsNeLng.toFixed(4) || "N/A"
              }`}</p>
            </div>
            <div className="flex justify-between">
              <h4>Southwest Boundary</h4>
              <p>{`${globalSettings.mapBoundsSwLat?.toFixed(4) || "N/A"}, ${
                globalSettings.mapBoundsSwLng.toFixed(4) || "N/A"
              }`}</p>
            </div>
            <div className="flex justify-between">
              <h4>Default Zoom</h4>
              <p>{globalSettings.mapZoom || "N/A"}</p>
            </div>
            <div className="flex justify-between">
              <h4>Max Zoom</h4>
              <p>{globalSettings.mapZoomMax || "N/A"}</p>
            </div>
            <div className="flex justify-between">
              <h4>Min Zoom</h4>
              <p>{globalSettings.mapZoomMin || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={handleSave} className="mt-2">
        Update
      </Button>
    </div>
  );
}
