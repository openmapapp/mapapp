// hooks/useSocketConnection.ts
"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define your socket event interfaces
interface ServerToClientEvents {
  "report-added": (data: { report: any }) => void;
  "report-updated": (data: { report: any }) => void;
  "report-deleted": (data: { reportId: string | number }) => void;
  "report-voted": (data: { reportId: string | number; value: number }) => void;
}

interface ClientToServerEvents {
  "report-deleted": (data: { reportId: string | number }) => void;
  "report-added": (data: { report: any }) => void;
  "report-updated": (data: { report: any }) => void;
  "report-voted": (data: {
    reportId: string | number;
    userId: string;
    value: number;
  }) => void;
}

export function useSocketConnection() {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    // Only create socket on client-side
    if (typeof window !== "undefined" && !socket) {
      const newSocket = io("http://localhost:3005", {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }

    return undefined;
  }, []);

  return socket;
}
