import { useRequest } from "ahooks";
import { Col, Empty, Row, Spin, Typography } from "antd";
import React, { useEffect, useImperativeHandle, useState } from "react";
import styles from "./CardView.module.less";
import Overview from "./Overview";
import { getMedia } from "@/server";
import type { API } from "@/server/typings";
const { Text } = Typography;
export interface CardViewProps {
  column?: number;
  onPlay?: (item?: any) => void;
  onLoadingChange?: (loading: boolean) => void;
  actionRef?: React.MutableRefObject<
    undefined | null | { refresh: () => Promise<any> }
  >;
}
const CardView: React.FC<CardViewProps> = (props) => {
  const { column = 6, actionRef, onLoadingChange, onPlay } = props;
  const [overviewVisible, setOverviewVisible] = useState(false);
  const [overviewData, setOverviewData] = useState<API.Media | undefined>();
  const {
    runAsync: getList,
    data: list,
    loading
  } = useRequest(getMedia, { loadingDelay: 300 });
  const handleOverview = async (item: any) => {
    setOverviewData(item);
    setOverviewVisible(true);
  };
  const CardContent = () => {
    const Rows = [];
    let Cols: any[] = [];
    if (list) {
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        const CardDom = (
          <div className={styles.card}>
            <div
              className={styles.cover}
              style={{ backgroundImage: `url("${item.poster}")` }}
              onClick={() => handleOverview(item)}
            />
            <div className={styles.detail}>
              <div className={styles.title}>
                <Text ellipsis={{ tooltip: item.title }}>{item.title}</Text>
              </div>
            </div>
          </div>
        );
        Cols.push(
          <Col
            span={24 / column}
            key={`line${Rows.length}row${Cols.length + 1}`}
          >
            {CardDom}
          </Col>
        );
        // 当可以换行或者最后一个元素的时候，则生成一个row
        if (Cols.length % column === 0 || index === list.length - 1) {
          Rows.push(
            <Row
              gutter={16}
              style={{ marginBottom: 16 }}
              key={`line${Rows.length + 1}`}
            >
              {Cols}
            </Row>
          );
          Cols = [];
        }
      }
    }

    return Rows;
  };
  useImperativeHandle(actionRef, () => ({
    refresh: getList
  }));
  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading]);

  return (
    <div className="full">
      <Spin spinning={loading} tip="正在加载中...">
        <div className={styles.contentContainer}>
          {list?.length === 0 ? (
            <Empty description="暂无数据" />
          ) : (
            CardContent()
          )}
        </div>
      </Spin>
      <Overview
        visible={overviewVisible}
        data={overviewData}
        onClose={() => setOverviewVisible(false)}
        onPlay={onPlay}
      />
    </div>
  );
};
export default CardView;
