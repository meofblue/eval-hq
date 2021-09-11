import React, { useState } from "react";
import Link from "next/link";
import { Layout, Menu } from "antd";
import {
  PictureOutlined,
  CrownOutlined,
  HeatMapOutlined,
  TableOutlined,
  ScheduleOutlined,
  TrophyOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import styles from "./index.module.css";
import { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;

const menus = [
  {
    key: "dashboard",
    path: "/dashboard",
    icon: <TrophyOutlined />,
    name: "首页",
  },
  {
    key: "art",
    path: "/art",
    icon: <PictureOutlined />,
    name: "艺术品",
  },
  {
    key: "artist",
    path: "/artist",
    icon: <CrownOutlined />,
    name: "艺术家",
  },
  {
    key: "museum",
    path: "/museum",
    icon: <HeatMapOutlined />,
    name: "博物馆",
  },
  {
    key: "movement",
    path: "/movement",
    icon: <HistoryOutlined />,
    name: "运动流派",
  },
  // {
  //   key: "collection",
  //   path: "/collection",
  //   icon: <TableOutlined />,
  //   name: "集合",
  // },
  // {
  //   key: "event",
  //   path: "/event",
  //   icon: <ScheduleOutlined />,
  //   name: "活动",
  // },
];

export default function BasicLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useRouter();
  console.log(pathname)
  const activeMenu = menus.find((item) => pathname.split('/')[1] === item.key ) || menus[0];

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className={styles.background} style={{ padding: 0 }}>
        <div className={styles.logo} />
      </Header>
      <Content className={styles.main}>
        <Layout className={styles.layout}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={handleCollapse}
            theme="light"
          >
            <Menu defaultSelectedKeys={[activeMenu.key]} mode="inline">
              {menus.map((item) => (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link href={item.path}>{item.name}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
          <Content style={{ padding: "0 24px" }}>
            <div className={styles.background}>{children}</div>
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        BYEVAL ©2021 Created by xuhong
      </Footer>
    </Layout>
  );
}
