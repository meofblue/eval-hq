import { useState } from "react";
import Link from "next/link";
import { Button, Checkbox, Input, Space, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useMovements } from "api";
import Head from "components/head";
import Filter from "components/filter";
import styles from "./index.module.css";

const fields = [
  {
    span: 6,
    label: "艺术流派",
    name: "name",
    Field: Input,
    fieldProps: {
      placeholder: "请输入流派名称",
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

const PERIOD_MAP = ["早期", "中期", "后期"];

export default function MovementList() {
  const [filter, setFilter] = useState<any>({});
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { data, error } = useMovements({
    current,
    pageSize,
    ...filter,
  });

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const columns = [
    {
      title: "流派名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "开始时间",
      dataIndex: "startCentury",
      key: "startCentury",
      render: (value: number, record: any) => {
        return (
          <span>
            {value}世纪{PERIOD_MAP[record.startPeriod]}（{record.startYear}）
          </span>
        );
      },
    },
    {
      title: "结束时间",
      dataIndex: "endCentury",
      key: "endCentury",
      render: (value: number, record: any) => {
        return (
          <span>
            {value}世纪{PERIOD_MAP[record.endPeriod]}（{record.endYear}）
          </span>
        );
      },
    },
    {
      title: "编辑",
      dataIndex: "edit",
      key: "edit",
      render: (value: any, record: any) => {
        return (
          <Link href={`/movement/${record._id}`}>
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
      <Head title="艺术流派" />

      <main className={styles.main}>
        <Space style={{ width: "100%" }} size="middle" direction="vertical">
          <Link href="movement/add">
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
