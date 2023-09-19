// this file handles the video streaming
import React, { useState, useEffect, useRef } from "react";

import socket from "../socket";

import Peer from "simple-peer";

function VideoChat() {
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  const myVideoRef = useRef();
  const userVideoRef = useRef();
  const peerRef = useRef();

  useEffect(() => {
    // Event listeners for video call

    socket.on("callUser", ({ signal, from, name }) => {
      // Handle incoming call here
      // Display a modal or notification to accept or reject the call

      const peer = new Peer({ initiator: false, trickle: false, stream });

      peer.on("signal", (data) => {
        socket.emit("answerCall", { signal: data, to: from });
      });

      peer.on("stream", (userStream) => {
        userVideoRef.current.srcObject = userStream;
      });

      peer.signal(signal);
      peerRef.current = peer;
    });

    socket.on("callAccepted", (data) => {
      // Handle accepted call here
      setIsCallAccepted(true);
      peerRef.current.signal(data.signal);
    });

    socket.on("endCall", () => {
      // Handle call ended event here
      setIsCallEnded(true);
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    });

    // Get user media (camera and microphone)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((userStream) => {
        setStream(userStream);
        myVideoRef.current.srcObject = userStream;
      });

    // Clean up event listeners on component unmount
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  const handleAcceptCall = () => {
    // Handle accepting the call
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: userToCall });
    });

    peer.on("stream", (userStream) => {
      userVideoRef.current.srcObject = userStream;
    });

    peerRef.current = peer;
  };

  const handleRejectCall = () => {
    // Handle rejecting the call and notify the server
    socket.emit("endCall", { id: userToCall });
    setIsCallAccepted(false);
    if (peerRef.current) {
      peerRef.current.destroy();
    }
  };

  const handleEndCall = () => {
    // Handle ending the call and notify the server
    socket.emit("endCall", { id: userToCall });
    setIsCallAccepted(false);
    setIsCallEnded(true);
    if (peerRef.current) {
      peerRef.current.destroy();
    }
  };

  return (
    <div>
      {/* Render local video */}
      <video ref={myVideoRef} autoPlay muted style={{ width: "200px" }} />

      {isCallAccepted ? (
        // Render the video call UI here
        <div>
          {/* Render remote video */}
          <video ref={userVideoRef} autoPlay style={{ width: "200px" }} />
          <button onClick={handleEndCall}>End Call</button>
        </div>
      ) : (
        // Render the call request UI here
        <div>
          <button onClick={handleAcceptCall}>Accept Call</button>
          <button onClick={handleRejectCall}>Reject Call</button>
        </div>
      )}

      {isCallEnded && <div>Call Ended</div>}
    </div>
  );
}

export default VideoChat;
