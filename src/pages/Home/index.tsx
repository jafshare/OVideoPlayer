import React, { useRef, useState } from "react";
import type { MenuProps } from "antd";
import { Button, Dropdown, Empty, Spin, Tree, Typography } from "antd";
import { PlayCircleOutlined, SnippetsOutlined } from "@ant-design/icons";
import { useMount, useRequest, useSize } from "ahooks";
import type { DataNode } from "antd/es/tree";
import PlayerModal from "./components/PlayerModal";
import styles from "./index.module.less";
import { getDir, getFileStreamURL } from "@/server";
const Text = Typography.Text;
const transNodeData = (
  data: any[],
  extra?: Record<string, any>
): DataNode[] => {
  return data.map((item) => {
    const children = item.type === "directory" ? [] : undefined;
    const items: MenuProps["items"] = [
      {
        label: "播放",
        key: "play",
        onClick: () => {
          extra?.onClick?.(item);
          console.log(item);
        }
      }
    ];
    const isVideo = item?.mime?.startsWith("video") || false;
    const VideoTitleRender = (
      <Dropdown menu={{ items }} trigger={["contextMenu"]}>
        <Text ellipsis={{ tooltip: item.basename }}>{item.basename}</Text>
      </Dropdown>
    );
    const TitleRender =
      item.type !== "directory" && isVideo ? (
        VideoTitleRender
      ) : (
        <Text ellipsis={{ tooltip: item.basename }}>{item.basename}</Text>
      );
    return {
      title: TitleRender,
      key: item.filename,
      children,
      data: item,
      icon:
        item.type !== "directory" ? (
          isVideo ? (
            <PlayCircleOutlined />
          ) : (
            <SnippetsOutlined />
          )
        ) : null,
      isLeaf: item.type !== "directory"
    };
  });
};
const updateTreeData = (
  list: DataNode[],
  key: React.Key,
  children: DataNode[]
): DataNode[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children)
      };
    }
    return node;
  });

const Home = () => {
  const contentRef = useRef(null);
  const size = useSize(contentRef);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [visible, setVisible] = useState(false);
  const [src, setSrc] = useState("");
  const { runAsync: getDirContent, loading } = useRequest(
    async (params: { path: string; root: boolean; key?: string }) => {
      const { path = "", root = false, key } = params || {};
      if (!path) return;
      const data = await getDir(path);
      const transformedData = transNodeData(data as any[], {
        onClick: async (item: any) => {
          const file = await getFileStreamURL(item.filename);
          setSrc(file);
          setVisible(true);
        }
      });
      if (root) {
        setTreeData(transformedData);
      } else {
        setTreeData((nodes: DataNode[]) =>
          updateTreeData(nodes, key as string, transformedData)
        );
      }
    },
    { loadingDelay: 300 }
  );
  const onLoadData = async (node: DataNode) => {
    await getDirContent({ path: node.key, key: node.key, root: false });
  };
  const handleRefresh = () => {
    getDirContent({ path: "/", root: true });
  };
  useMount(() => {
    handleRefresh();
  });

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Button type="primary" loading={loading} onClick={handleRefresh}>
            刷新
          </Button>
        </div>
        <div className={styles.content} ref={contentRef}>
          <Spin spinning={loading} tip="正在加载中...">
            {treeData.length === 0 ? (
              <Empty description="暂无数据" />
            ) : (
              <Tree
                loadData={onLoadData}
                treeData={treeData}
                style={{ textAlign: "left" }}
                height={size?.height}
                showIcon
                showLine
                blockNode
              />
            )}
          </Spin>
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
