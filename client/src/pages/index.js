import React from "react";
import VideoChat from "../components/VideoChat";

const HomePage = () => {
  return (
    <>
      <div>
        <h1 style={{ textAlign: "Center", color: "blue" }}>Connect-me</h1>
      </div>
      <VideoChat /> {/* Render VideoChat component */}
    </>
  );
};

export default HomePage;
