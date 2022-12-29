import React from "react";
import { Drawer } from "antd";
import styles from "./PlayModal.module.less";
import VideoPlayer from "@/components/VideoPlayer";

const PlayerModal: React.FC<{
  visible: boolean;
  src: string;
  onCancel?: () => void;
}> = (props) => {
  const { visible, src, onCancel } = props;
  return (
    <Drawer
      className={styles.fullscreen}
      open={visible}
      placement="bottom"
      height="100%"
      closable={false}
      destroyOnClose
    >
      <VideoPlayer
        options={{ video: { url: src }, autoplay: true }}
        onClose={onCancel}
      />
    </Drawer>
  );
};
export default PlayerModal;
