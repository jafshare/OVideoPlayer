import React from "react";
import ReactPlayer from "react-player";
import type { ReactPlayerProps } from "react-player";
import styles from "./index.module.less";
const VideoPlayer: React.FC<{
  source: ReactPlayerProps["url"];
  options?: Omit<ReactPlayerProps, "url">;
}> = (props) => {
  const { source, ...rest } = props || {};
  return (
    <div className={styles.playerWrapper}>
      <ReactPlayer
        className={styles.player}
        width="100%"
        height="100%"
        url={source}
        controls
        playing
        {...rest}
      />
    </div>
  );
};
export default VideoPlayer;
