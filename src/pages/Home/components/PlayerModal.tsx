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
      placement="bottom"
      height="100%"
      closable={false}
      destroyOnClose
    >
      <CloseOutlined onClick={onCancel} className={styles.close} />
      <VideoPlayer source={src} />
    </Drawer>
  );
};
export default PlayerModal;
