import React, { useEffect, useRef, useState } from "react";
import type { DPlayerOptions } from "dplayer";
import DPlayer from "dplayer";
import { createPortal } from "react-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
const VideoPlayer: React.FC<{
  options?: Omit<DPlayerOptions, "container">;
  onClose?: () => void;
}> = (props) => {
  const { options, onClose, ...rest } = props;
  const artRef = useRef();
  useEffect(() => {
    const art = new DPlayer({
      ...options,
      // @ts-expect-error
      container: artRef.current
    });
    return () => {
      if (art && art.destroy) {
        art.destroy();
      }
    };
  }, []);
  return (
    <div className={styles.playerWrapper}>
      <div className={styles.player} ref={artRef as any} {...rest}></div>
      <ArrowLeftOutlined onClick={onClose} className={styles.back} />
    </div>
  );
};
export default VideoPlayer;
