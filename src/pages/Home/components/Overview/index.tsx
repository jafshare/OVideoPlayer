import React from "react";
import { Button, Drawer, Space, Typography } from "antd";
import { useRequest, useUpdateEffect } from "ahooks";
import { LeftOutlined } from "@ant-design/icons";
import type { Overview as Typings } from "../../typings";
import styles from "./index.module.less";
import { getMediaDetail } from "@/server";
const { Text, Paragraph } = Typography;
const Overview: React.FC<Typings.Props> = (props) => {
  const { visible, data, onClose, onPlay } = props;
  const {
    data: detail,
    loading,
    runAsync: fetchDetail
  } = useRequest(getMediaDetail, {
    manual: true
  });
  useUpdateEffect(() => {
    if (visible && data?.id) {
      fetchDetail(data.id);
    }
  }, [visible, data]);
  return (
    <Drawer
      open={visible}
      className={styles.overviewWrapper}
      placement="bottom"
      height="100%"
      closable={false}
      destroyOnClose
    >
      <div className={styles.contentWrapper}>
        <div
          className={styles.background}
          style={{ backgroundImage: `url("${data?.poster}")` }}
        />
        <LeftOutlined className={styles.close} onClick={onClose} />
        <div className={styles.content}>
          <div className={styles.contentTop}>
            <div
              className={styles.poster}
              style={{ backgroundImage: `url("${data?.poster}")` }}
            />
            <div className={styles.detail}>
              <Text
                className={styles.title}
                ellipsis={{ tooltip: data?.title }}
              >
                {data?.title}
              </Text>
              <div className={styles.label}>
                2022 · 119分钟 · 6.9 · 悬疑 · 动作
              </div>
              <Paragraph ellipsis={{ rows: 6 }} className={styles.overview}>
                {data?.description}
              </Paragraph>
              <div className={styles.other}>
                <Space>
                  <Button type="primary" onClick={() => onPlay?.(detail!)}>
                    播放
                  </Button>
                  <Button type="primary">信息修正</Button>
                </Space>
              </div>
            </div>
          </div>
          <div className={styles.contentBottom}></div>
        </div>
      </div>
    </Drawer>
  );
};
export default Overview;
