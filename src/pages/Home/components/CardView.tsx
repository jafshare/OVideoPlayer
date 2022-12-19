import { useRequest } from "ahooks";
import { Card, Col, Empty, Row, Spin } from "antd";
import React from "react";
export interface CardViewProps {
  column?: number;
}
const CardView: React.FC<CardViewProps> = (props) => {
  const { column = 6 } = props;
  const {
    runAsync: getList,
    data: list = [],
    loading
  } = useRequest(
    async (params: { path: string; root: boolean; key?: string }) => {
      return [
        { title: "明日之间" },
        { title: "快乐的喜喜" },
        { title: "快乐的喜喜1" },
        { title: "快乐的喜喜2" },
        { title: "快乐的喜喜3" },
        { title: "快乐的喜喜4" },
        { title: "快乐的喜喜5" },
        { title: "快乐的喜喜6" },
        { title: "快乐的喜喜7" },
        { title: "快乐的喜喜8" },
        { title: "快乐的喜喜9" }
      ];
    },
    { loadingDelay: 300 }
  );
  const CardContent = () => {
    const Rows = [];
    let Cols: any[] = [];
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const CardDom = (
        <Card
          bordered={false}
          className="full"
          cover={
            <img src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
          }
          hoverable
        >
          {item.title}
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
  return (
    <div className="full">
      <Spin spinning={loading} tip="正在加载中...">
        {list.length === 0 ? <Empty description="暂无数据" /> : CardContent()}
      </Spin>
    </div>
  );
};
export default CardView;
