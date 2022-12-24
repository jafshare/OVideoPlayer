import { useRequest } from "ahooks";
import { Card, Col, Empty, Row, Spin } from "antd";
import React, { useEffect, useImperativeHandle } from "react";
import classnames from "classnames";
import styles from "./CardView.module.less";
import { getMedia, getMediaDetail } from "@/server";
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
  const {
    runAsync: getList,
    data: list = [],
    loading
  } = useRequest(
    async () => {
      const res = await getMedia();
      if (res.code === 1) {
        return res.data;
      }
      return [];
    },
    { loadingDelay: 300 }
  );
  const handlePlay = async (item: any) => {
    const res = await getMediaDetail(item.id);
    onPlay?.(res.data);
  };
  const CardContent = () => {
    const Rows = [];
    let Cols: any[] = [];
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const CardDom = (
        <Card
          bordered={false}
          className={classnames("full", styles.card)}
          onClick={() => handlePlay(item)}
          hoverable
        >
          <div className={styles.cardContentWrapper}>
            <div className={styles.cover}>
              <img
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                title={item.title}
              />
            </div>
            <div className={styles.detail}>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.time}>1:30:50</div>
            </div>
          </div>
        </Card>
      );
      Cols.push(
        <Col span={24 / column} key={`line${Rows.length}row${Cols.length + 1}`}>
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
          {list.length === 0 ? <Empty description="暂无数据" /> : CardContent()}
        </div>
      </Spin>
    </div>
  );
};
export default CardView;
