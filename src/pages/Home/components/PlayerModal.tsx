import React from "react";
import { CloseOutlined } from "@ant-design/icons";
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
      onClose={onCancel}
      placement="bottom"
      height="100%"
      closable={false}
      destroyOnClose
    >
      <CloseOutlined className={styles.close} />
      <VideoPlayer
        option={{
          url: src,
          autoplay: true, // 自动播放
          playbackRate: true, // 显示网速
          fullscreen: true
        }}
      />
    </Drawer>
  );
};
export default PlayerModal;
