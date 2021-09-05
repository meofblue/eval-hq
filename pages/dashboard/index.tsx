import React from "react";
import { Row, Col, Card, Space, Divider } from "antd";

export default function Dashboard() {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="艺术品">
          20215
        </Card>
      </Col>
      <Col span={8}>
        <Card title="艺术家">
          2288
        </Card>
      </Col>
      <Col span={8}>
        <Card title="博物馆">
          250
        </Card>
      </Col>
      <Divider />
      <Col span={8}>
        <Card title="公众号">
          250
        </Card>
      </Col>
      <Col span={8}>
        <Card title="抖音">
          250
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Bilibili">
          250
        </Card>
      </Col>
    </Row>
  );
}
