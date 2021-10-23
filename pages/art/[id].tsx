import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  notification,
  Tooltip,
} from "antd";
import Head from "components/head";
import { Error, Loading } from "components/index";
import {
  ArtistSelect,
  MuseumSelect,
  GenreSelect,
  ObjectTypeSelect,
  MovementSelect,
  MediumSelect,
  Picture,
} from "components/fields";
import { useArt, updateArt } from "api";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

export default function Art() {
  const [updating, setUpdating] = useState(false);
  const { query } = useRouter();

  const { data, error } = useArt(query.id as string);

  if (error) return <Error />;
  if (!data) return <Loading />;

  data.nameEn = data.nameEn || data.name;

  const handleSubmit = (values) => {
    setUpdating(true);

    delete values.thumbnail;

    updateArt(query.id as string, values)
      .then(() => {
        notification.success({
          message: "更新成功",
        });
      })
      .finally(() => setUpdating(false));
  };

  return (
    <div>
      <Head title="编辑" />
      <Form
        name="artist"
        {...formItemLayout}
        onFinish={handleSubmit}
        initialValues={data}
      >
        <Form.Item
          label="中文名称"
          name="name"
          rules={[{ required: true, message: "请输入艺术品中文名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="英文名称"
          name="nameEn"
          rules={[{ required: true, message: "请输入艺术品英文名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="缩略图"
          name="thumbnail"
          rules={[{ required: false, message: "请上传艺术品缩略图" }]}
        >
          <Picture />
        </Form.Item>
        <Form.Item
          label="wiki链接"
          name="wikiLink"
          rules={[{ required: true, message: "维基百科艺术品主页" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="文件链接" name="fileLink">
          <Input />
        </Form.Item>
        <Form.Item
          label="艺术家"
          name="artist"
          rules={[{ required: true, message: "请选择艺术家" }]}
        >
          <ArtistSelect />
        </Form.Item>
        <Form.Item
          label="博物馆"
          name="museum"
          rules={[{ required: true, message: "请选择博物馆" }]}
        >
          <MuseumSelect />
        </Form.Item>
        <Form.Item
          label="物理类型"
          name="objectType"
          rules={[{ required: true, message: "请输入艺术类型" }]}
        >
          <ObjectTypeSelect />
        </Form.Item>
        <Form.Item
          label="绘画媒介"
          name="medium"
          rules={[{ required: true, message: "请输入艺术品媒介" }]}
        >
          <MediumSelect />
        </Form.Item>
        <Form.Item
          label="内容类型"
          name="genre"
          rules={[{ required: true, message: "请输入内容类型" }]}
        >
          <GenreSelect />
        </Form.Item>
        <Form.Item
          label="艺术流派"
          name="movement"
          rules={[{ required: true, message: "请输入艺术流派" }]}
        >
          <MovementSelect />
        </Form.Item>
        <Form.Item
          label={<Tooltip title={data.dimensions}>高度</Tooltip>}
          name="height"
          rules={[{ required: true, message: "请输入艺术品高度/cm" }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label={<Tooltip title={data.dimensions}>宽度</Tooltip>}
          name="width"
          rules={[{ required: true, message: "请输入艺术品宽度/cm" }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="日期"
          name="date"
          rules={[{ required: true, message: "请输入创作时期" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: "请输入艺术品简介" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="是否公开" name="public" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button loading={updating} type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
