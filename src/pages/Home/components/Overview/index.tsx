import React from "react";
import { useRequest } from "ahooks";
import { useNavigate, useParams } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { getMediaDetail } from "@/server";
const Overview = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading } = useRequest(() => getMediaDetail(params.id!));
  console.log("data:", data, loading);
  return (
    <div className="overview-wrapper">
      <LeftOutlined onClick={() => navigate("/")} />
      <div className="title">{data?.title}</div>
      <div className="overview"></div>
      <div className="other"></div>
    </div>
  );
};
export default Overview;
