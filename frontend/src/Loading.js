import React from "react";
import Container from "./Container";
import VideoBackground from "../img/worldcoin-product-card-world-app-text.svg";
import Video from "../img/worldcoin-product-card-world-app-globe.mp4";

function Loading() {
  return (
    <Container>
      <div className="relative h-full w-full scale-50">
        <video
          loop
          playsInline
          autoPlay
          muted
          src={Video}
          className="h-full w-full scale-125 object-contain [clip-path:circle(32%_at_50%_50%)]"
        ></video>
        <img
          className="absolute inset-0 h-full w-full object-contain animate-[reverse-spin_20s_linear_infinite] [animation-play-state:running]"
          src={VideoBackground}
        ></img>
        <div className="text-6xl font-semibold text-center pt-40">
          Loading...
        </div>
      </div>
    </Container>
  );
}
export default Loading;
