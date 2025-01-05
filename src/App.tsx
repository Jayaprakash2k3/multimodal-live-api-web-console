import { useRef, useState, useEffect } from "react";
import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import SidePanel from "./components/side-panel/SidePanel";
import ControlTray from "./components/control-tray/ControlTray";
import cn from "classnames";
import { computerControlDeclarations } from "./tools/ComputerControl";
import { ComputerControl } from "./components/computer-control/ComputerControl";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  return (
    <div className="App">
      <LiveAPIProvider 
        url={uri} 
        apiKey={API_KEY}
      >
        <div className="streaming-console">
          <SidePanel />
          <main>
            <div className="main-app-area">
              <iframe
                src="https://zakya.zoho.com"
                className="zoho-frame"
                title="Zoho Zakya"
                allow="microphone; camera; fullscreen"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
              <video
                style={{ display: "none" }}
                className={cn("stream", {
                  hidden: !videoRef.current || !videoStream,
                })}
                ref={videoRef}
                autoPlay
                playsInline
              />
            </div>
            <div
              className="control-tray-wrapper"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <ControlTray
                videoRef={videoRef}
                supportsVideo={true}
                onVideoStreamChange={setVideoStream}
              />
            </div>
          </main>
        </div>
        <ComputerControl />
      </LiveAPIProvider>
    </div>
  );
}

export default App;