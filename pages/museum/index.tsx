import { useState } from "react";
import Link from "next/link";
import { Button, Checkbox, Form, Input, Space, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useMuseums } from "api";
import Head from "components/head";
import Filter from "components/filter";
import styles from "./index.module.css";

const fields = [
  {
    span: 6,
    label: "名称",
    name: "name",
    Field: Input,
    fieldProps: {
      placeholder: "博物馆名称",
    },
  },
  {
    span: 6,
    label: "上线",
    name: "public",
    Field: Checkbox,
    itemProps: { valuePropName: "checked" },
  },
];

export default function MuseumList() {
  const [filter, setFilter] = useState<any>({});
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { data, error } = useMuseums({
    current,
    pageSize,
    ...filter,
  });

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const columns = [
    {
      title: "照片",
      dataIndex: "photoUrl",
      key: "photoUrl",
      render: (value: any, record: any, index: number) => {
        return <img style={{ maxHeight: 100 }} src={value} />;
      },
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (value: any, record: any, index: number) => {
        return (
          <a target="_blank" href={record.wikiLink}>
            {record.name}
          </a>
        );
      },
    },
    {
      title: "创建于",
      dataIndex: "established",
      key: "established",
    },
    {
      title: "位于",
      dataIndex: "country",
      key: "country",
    },

    {
      title: "编辑",
      dataIndex: "edit",
      key: "edit",
      render: (value: any, record: any) => {
        return (
          <Link href={`/museum/${record._id}`}>
            <Button size="small">
              <EditOutlined />
            </Button>
          </Link>
        );
      },
    },
  ];

  const handlePageChange = ({ current, pageSize }) => {
    setPageSize(pageSize);
    setCurrent(current);
  };

  const handleSubmit = (val) => {
    setFilter(val);
  };

  return (
    <div className={styles.container}>
      <Head title="博物馆" />

      <main className={styles.main}>
        <Space style={{ width: "100%" }} size="middle" direction="vertical">
          <Link href="artist/add">
            <Button type="primary">新增</Button>
          </Link>
          <Filter fields={fields} onSubmit={handleSubmit} />
          <Table
            columns={columns}
            rowKey="_id"
            dataSource={data.data}
            pagination={data.pagination}
            onChange={handlePageChange}
          />
        </Space>
      </main>
    </div>
  );
}
