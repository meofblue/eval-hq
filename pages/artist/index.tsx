import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Checkbox, Input, Space, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useArtists } from "api";
import { useStorage } from "hooks";
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
      placeholder: "请输入艺术家名称",
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

export default function ArtistList() {
  const { pathname } = useRouter();
  const [cache, setCache] = useStorage(pathname);
  const [filter, setFilter] = useState<any>(cache);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { data, error } = useArtists({
    current,
    pageSize,
    ...filter,
  });

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const columns = [
    {
      title: "头像",
      dataIndex: "photoUrl",
      key: "photoUrl",
      render: (value: any, record: any, index: number) => {
        return <img style={{ maxHeight: 100 }} src={value} />;
      },
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      render: (value: any, record: any, index: number) => {
        return (
          <a target="_blank" href={record.wikiLink}>
            {value}
          </a>
        );
      },
    },
    {
      title: "国籍",
      dataIndex: "nation",
      key: "nation",
    },
    {
      title: "出生于",
      dataIndex: "date",
      key: "birthday",
      render: (value: any, record: any, index: number) => {
        return (
          <span>
            {record.locationOfBirth ||
              (record.locationOfBirthDeath && record.locationOfBirthDeath[0]) ||
              "-"}
            (
            {record.dateOfBirth ||
              (record.dateOfBirthDeath && record.dateOfBirthDeath[0]) ||
              "-"}
            )
          </span>
        );
      },
    },
    {
      title: "死于",
      dataIndex: "date",
      key: "deathday",
      render: (value: any, record: any, index: number) => {
        return (
          <span>
            {record.locationOfDeath ||
              (record.locationOfBirthDeath && record.locationOfBirthDeath[1]) ||
              "-"}
            (
            {record.dateOfDeath ||
              (record.dateOfBirthDeath && record.dateOfBirthDeath[1]) ||
              "-"}
            )
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
    setCache(val);
  };

  return (
    <div className={styles.container}>
      <Head title="艺术家" />

      <main className={styles.main}>
        <Space style={{ width: "100%" }} size="middle" direction="vertical">
          <Link href="artist/add">
            <Button type="primary">新增</Button>
          </Link>
          <Filter initialValues={filter} fields={fields} onSubmit={handleSubmit} />
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
