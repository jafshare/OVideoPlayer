import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useMount, useRequest, useSize } from "ahooks";
import type { MenuProps } from "antd";
import { Dropdown, Empty, Spin, Tree, Typography } from "antd";
import type { DataNode } from "antd/es/tree";
import { PlayCircleOutlined, SnippetsOutlined } from "@ant-design/icons";
import { getDir } from "@/server";
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
const TreeView: React.FC<{
  onPlay?: (item?: any) => void;
  onLoadingChange?: (loading: boolean) => void;
  actionRef?: React.MutableRefObject<
    undefined | null | { refresh: () => Promise<any> }
  >;
}> = (props) => {
  const { actionRef, onLoadingChange } = props;
  const contentRef = useRef(null);
  const size = useSize(contentRef);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const { runAsync: getDirContent, loading } = useRequest(
    async (params: { path: string; root: boolean; key?: string }) => {
      const { path = "", root = false, key } = params || {};
      if (!path) return;
      const data = await getDir(path);
      const transformedData = transNodeData(data as any[], {
        onClick: props?.onPlay
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
  const handleRefresh = async () => {
    await getDirContent({ path: "/", root: true });
  };
  useImperativeHandle(actionRef, () => ({
    refresh: handleRefresh
  }));
  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading]);

  useMount(() => {
    handleRefresh();
  });
  return (
    <div className="full" ref={contentRef}>
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
  );
};
export default TreeView;
