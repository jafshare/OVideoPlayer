import React, { useEffect, useRef } from "react";
import Artplayer from "artplayer";
const VideoPlayer: React.FC<{
  option: Omit<Artplayer["option"], "container">;
  getInstance?: (art: Artplayer) => any;
}> = (props) => {
  const { getInstance, option, ...rest } = props || {};
  const artRef = useRef<HTMLDivElement>();
  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current as any
    });
    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }
    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
    /* eslint-disable */
  }, []);
  return (
    <div
      ref={artRef as any}
      style={{ width: "100%", height: "100%" }}
      {...rest}
    ></div>
  );
};
export default VideoPlayer;
