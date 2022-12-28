import React, { useRef } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import type { APITypes } from "plyr-react";
import styles from "./PlayModal.module.less";
import VideoPlayer from "@/components/VideoPlayer";

const PlayerModal: React.FC<{
  visible: boolean;
  src: string;
  onCancel?: () => void;
}> = (props) => {
  const { visible, src, onCancel } = props;
  const videoRef = useRef<APITypes>();
  return (
    <Drawer
      className={styles.fullscreen}
      open={visible}
      placement="bottom"
      height="100%"
      closable={false}
      destroyOnClose
    >
      <CloseOutlined onClick={onCancel} className={styles.close} />
      <VideoPlayer
        videoRef={videoRef as any}
        source={{ type: "video", sources: [{ src }] }}
        options={{ autoplay: true }}
      />
    </Drawer>
  );
};
export default PlayerModal;
