import { useState } from "react";
import Link from "next/link";
import { Button, Checkbox, Input, Space, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useArts } from "api";
import Head from "components/head";
import ArtistSelectField from "components/artist-select";
import MuseumSelectField from "components/museum-select";
import Filter from "components/filter";
import styles from "./index.module.css";

const fields = [
  {
    span: 6,
    label: "名称",
    name: "name",
    Field: Input,
    fieldProps: {
      placeholder: "艺术品名称",
    },
  },
  {
    span: 6,
    label: "艺术家",
    name: "artist",
    Field: ArtistSelectField,
    fieldProps: {},
  },
  {
    span: 6,
    label: "博物馆",
    name: "museum",
    Field: MuseumSelectField,
    fieldProps: {},
  },
  {
    span: 6,
    label: "上线",
    name: "public",
    Field: Checkbox,
    itemProps: { valuePropName: "checked" },
    fieldProps: {},
  },
];

export default function Art() {
  const [filter, setFilter] = useState<any>({});
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { data, error } = useArts({
    current,
    pageSize,
    ...filter,
  });

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const columns = [
    {
      title: "缩略图",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (value: any, record: any, index: number) => {
        return null;
        return <img style={{ maxWidth: 100 }} src={record.fileLink} />;
      },
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (value: any, record: any, index: number) => {
        return (
          <a target="_blank" href={record.wikiLink}>
            {record.name || record.nameEn}
          </a>
        );
      },
    },
    {
      title: "材料",
      dataIndex: "medium",
      key: "medium",
      render: (value: string) => {
        return value.slice(0, 20);
      },
    },
    {
      title: "艺术家",
      dataIndex: "artist",
      key: "artist",
      render: (value: any, record: any, index: number) => {
        return <span>{value && value.name}</span>;
      },
    },
    {
      title: "博物馆",
      dataIndex: "museum",
      key: "museum",
      render: (value: any, record: any, index: number) => {
        return <span>{value && value.name}</span>;
      },
    },
    {
      title: "编辑",
      dataIndex: "edit",
      key: "edit",
      render: (value: any, record: any) => {
        return (
          <Link href={`/artist/${record._id}`}>
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
      <Head title="艺术品" />

      <main className={styles.main}>
        <Space style={{ width: "100%" }} size="middle" direction="vertical">
          <Link href="/art/add">
            <Button type="primary">新增</Button>
          </Link>
          <Filter fields={fields} initialValues={filter} onSubmit={handleSubmit} />
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
