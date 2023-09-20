// this file handles the video streaming
import React, { useState, useEffect, useRef } from "react";

import socket from "../socket";

import Peer from "simple-peer";
import CopyToClipboard from "react-copy-to-clipboard";
function VideoChat() {
  const [me, setMeID] = useState("");
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);

  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const Peer = useRef();
  const connectionRef= useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    socket.on("me", (id) => {
      setMeID(id);
    });

    // Handle incoming call here
    socket.on("callUser", ({ signal, from, name }) => {
      setReceivingCall(true);
      setCaller(from);
      setName(name);
      setCallerSignal(signal);
    });
  }, {});

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };
  const answerCall = () => {
    setCallAccepted(true);
    const peer = Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };
  const endCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  return (
    <>
      <div className="container">
        <div className="video-container">
          <div className="video">
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            )}
          </div>
          <div className="video">
            {callAccepted && !callEnded ? (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div>
        {receivingCall && !callAccepted ? (
          <div className="caller">
            {" "}
            <h1>{name} is calling...</h1>
            <button variant="contained" color="primary" onClick={answerCall}>
              Answer
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default VideoChat;
