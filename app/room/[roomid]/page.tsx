"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

const Room = ({ params }: { params: Promise<{ roomid: string }> }) => {
  const elementRef = useRef<HTMLDivElement>(null);
const { data: session } = useSession();
  useEffect(() => {
    const setupMeeting = async () => {
      const { roomid } = await params; // Unwrap the params Promise
      const roomID = roomid;
      const fullName = session?.user?.name||'Enter Your Name Here';

      if (elementRef.current) {
        // Generate Kit Token
        const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          uuid(),
          fullName || "user" + Date.now(),
          720
        );

        // Create instance object from Kit Token
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Start the call
        zp.joinRoom({
          container: elementRef.current,
          sharedLinks: [
            {
              name: "Shareable link",
              url:
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?roomID=" +
                roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          maxUsers: 10,
        });
      }
    };

    setupMeeting();
  }, [params]);

  return <div className="w-full h-screen" ref={elementRef}></div>;
};

export default Room;
