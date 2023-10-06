import { useEffect } from "react";
import Video from "../components/Video/Video";
import VideoState from "../context/VideoState";
import Options from "../components/Settings/Settings";

const Home = () => {
  if (!navigator.onLine) alert("Connect to internet!");

  useEffect(()=>{
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [])

 return (
  <VideoState>
    <div className="App" style={{ height: "100%", width: "100%" }}>
      <h1 style={{ textAlign: "center", color: "white" }}>Connect Me</h1>
      <Video />
      <Options />
    </div>
  </VideoState>
  );
};

export default Home;
