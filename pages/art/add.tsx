import { useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
} from "antd";
import Head from "components/head";
import ArtistSelectField from "components/artist-select";
import MuseumSelectField from "components/museum-select";
import { addArt } from "api";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

const PictureField: React.FC<any> = ({ value, onChange }) => {
  return (
    <div className="photo">
      <img style={{ maxHeight: 200 }} src={value} />
    </div>
  );
};

export default function AddArt() {
  const [updating, setUpdating] = useState(false);
  const { query } = useRouter();

  const handleSubmit = (values) => {
    setUpdating(true);

    addArt(values)
      .then(() => {
        notification.success({
          message: "创建成功",
        });
      })
      .finally(() => setUpdating(false));
  };

  return (
    <div>
      <Head title="新增" />
      <Form name="artist" {...formItemLayout} onFinish={handleSubmit}>
        <Form.Item
          label="中文名称"
          name="name"
          rules={[{ required: true, message: "请输入作品中文名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="英文名称"
          name="nameEn"
          rules={[{ required: true, message: "请输入作品英文名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="缩略图"
          name="photoUrl"
          rules={[{ required: true, message: "请上传作品缩略图" }]}
        >
          <PictureField />
        </Form.Item>
        <Form.Item
          label="作者"
          name="artist"
          rules={[{ required: true, message: "请选择作者" }]}
        >
          <ArtistSelectField />
        </Form.Item>
        <Form.Item
          label="博物馆"
          name="museum"
          rules={[{ required: true, message: "请选择当前所在博物馆" }]}
        >
          <MuseumSelectField />
        </Form.Item>
        <Form.Item
          label="wiki链接"
          name="wikiLink"
          rules={[{ required: true, message: "维基百科艺术家主页" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="创作日期"
          name="date"
          rules={[{ required: true, message: "请输入作品创作日期" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="材质"
          name="medium"
          // rules={[{ required: true, message: "请输入艺术家风格" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="类型" name="type">
          <Input />
        </Form.Item>
        <Form.Item label="尺寸" name="dimensions">
          <Input placeholder="宽度" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: "请输入作品简介" }]}
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
