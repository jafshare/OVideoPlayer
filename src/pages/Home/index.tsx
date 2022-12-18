import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Dropdown, Tree } from "antd";
import { useMount, useRequest } from "ahooks";
import type { DataNode } from "antd/es/tree";
import PlayerModal from "./components/PlayerModal";
import { getDir, getFileStreamURL } from "@/server";
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
    const TitleRender =
      item.type === "directory" ? (
        item.basename
      ) : (
        <Dropdown menu={{ items }} trigger={["contextMenu"]}>
          <div>{item.basename}</div>
        </Dropdown>
      );
    return {
      title: TitleRender,
      key: item.filename,
      children,
      data: item,
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
      console.log("transformedData:", transformedData);
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
    // const dir = await getDir("/");
    // console.log("node:", node);
    console.log("node:", node);
    await getDirContent({ path: node.key, key: node.key, root: false });
  };
  useMount(() => {
    getDirContent({ path: "/", root: true });
  });

  return (
    <>
      <Tree
        loadData={onLoadData}
        treeData={treeData}
        style={{ textAlign: "left" }}
        showLine
        blockNode
      />
      <PlayerModal
        visible={visible}
        src={src}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};
export default Home;
