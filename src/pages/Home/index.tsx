import React, { useRef, useState } from "react";
import { Button, Radio, Space } from "antd";
import PlayerModal from "./components/PlayerModal";
import styles from "./index.module.less";
import TreeView from "./components/TreeView";
import CardView from "./components/CardView";
import { getFileStreamURL, scan } from "@/server";
const typeOptions = [
  { label: "文件树", value: "tree" },
  { label: "视频库", value: "card" }
];
const Home = () => {
  const [visible, setVisible] = useState(false);
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const [type, setType] = useState("card");
  const handlePlay = async (item: any) => {
    const file = await getFileStreamURL(item.filename);
    setSrc(file);
    setVisible(true);
  };
  const handleRefresh = async () => {
    (containerRef?.current as any)?.refresh?.();
  };
  const handleScan = async () => {
    scan();
  };
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Space>
            <Button type="primary" loading={loading} onClick={handleRefresh}>
              刷新
            </Button>
            {type === "card" && (
              <Button type="primary" onClick={handleScan}>
                更新资源
              </Button>
            )}
          </Space>
          <Radio.Group
            options={typeOptions}
            value={type}
            onChange={(t) => setType(t.target.value)}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        <div className={styles.content}>
          {type === "tree" ? (
            <TreeView
              actionRef={containerRef}
              onPlay={handlePlay}
              onLoadingChange={(isLoading) => setLoading(isLoading)}
            />
          ) : (
            <CardView
              actionRef={containerRef}
              onPlay={handlePlay}
              onLoadingChange={(isLoading) => setLoading(isLoading)}
            />
          )}
        </div>
      </div>
      <PlayerModal
        visible={visible}
        src={src}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};
export default Home;
