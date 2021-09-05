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
import { Error, Loading } from "components/index";
import ArtistSelectField from "components/artist-select";
import MuseumSelectField from "components/museum-select";
import { useArt, updateArt } from "api";

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

export default function Art() {
  const [updating, setUpdating] = useState(false);
  const { query } = useRouter();

  const { data, error } = useArt(query.id as string);

  if (error) return <Error />;
  if (!data) return <Loading />;

  data.nameEn = data.nameEn || data.name;

  const handleSubmit = (values) => {
    setUpdating(true);

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
          label="头像"
          name="photoUrl"
          rules={[{ required: true, message: "请上传艺术品头像" }]}
        >
          <PictureField />
        </Form.Item>
        <Form.Item
          label="wiki链接"
          name="wikiLink"
          rules={[{ required: true, message: "维基百科艺术品主页" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="出生日期"
          name="dateOfBirth"
          rules={[{ required: true, message: "请输入艺术品出生日期" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="死亡日期"
          name="dateOfDeath"
          rules={[{ required: true, message: "请输入艺术品死亡日期" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="风格"
          name="style"
          // rules={[{ required: true, message: "请输入艺术品风格" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="类型" name="genre">
          <Input />
        </Form.Item>
        <Form.Item label="运动" name="movement">
          <Input placeholder="如文艺复兴" />
        </Form.Item>
        <Form.Item
          label="国籍"
          name="nation"
          rules={[{ required: true, message: "请输入艺术品国籍" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="出生地"
          name="locationOfBirth"
          rules={[{ required: true, message: "请输入艺术品出生地" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="死亡地"
          name="locationOfDeath"
          rules={[{ required: true, message: "请输入艺术品死亡地" }]}
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
