import React from "react";
import VideoChat from "../components/VideoChat";
import Chat from "../components/Chat";
import { Center } from "@chakra-ui/react";

const HomePage = () => {
  return (
    <>
      <div>
        <h1 style={{ textAlign: "Center", color: "blue" }}>Connect-me</h1>
      </div>

      <VideoChat />
    </>
  );
};

export default HomePage;
