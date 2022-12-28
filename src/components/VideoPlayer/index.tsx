import type { Ref } from "react";
import React from "react";
import type { APITypes, PlyrOptions, PlyrSource } from "plyr-react";
import { usePlyr } from "plyr-react";
import "plyr-react/plyr.css";
import classnames from "classnames";
import styles from "./index.module.less";
const VideoPlayer: React.FC<{
  videoRef: Ref<APITypes>;
  source: PlyrSource;
  options?: PlyrOptions;
}> = (props) => {
  const { source, videoRef, options, ...rest } = props || {};
  const raptorRef = usePlyr(videoRef, {
    source,
    options
  });
  return (
    <div className={styles.playerWrapper}>
      <video
        ref={raptorRef}
        className={classnames("plyr-react", "plyr")}
        {...rest}
      />
    </div>
  );
};
export default VideoPlayer;
