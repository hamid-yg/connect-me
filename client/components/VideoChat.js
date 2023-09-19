// this file handles the video streaming

import React, { useEffect, useRef } from "react";
import socket from "../socket";

const VideoChat = () => {
  const myVideoRef = useRef();
  const partnerVideoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideoRef.current.srcObject = stream;

        socket.emit("join", { stream });
      });

    socket.on("user-connected", (userId, userStream) => {
      partnerVideoRef.current.srcObject = userStream;
    });

    return () => {
      // Disconnect from the server when unmounting
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <video ref={myVideoRef} autoPlay muted />
      <video ref={partnerVideoRef} autoPlay />
    </div>
  );
};

export default VideoChat;
