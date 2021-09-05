import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Checkbox, DatePicker, Form, Input, notification } from "antd";
import moment from "moment";
import Head from "components/head";
import { useMuseum, updateMuseum } from "api";

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
  const { data, error } = useMuseum(query.id as string);

  if (error) return <div>Failed to load.</div>;
  if (!data) return <div>Loading...</div>;

  data.established = data.established ? moment(data.established) : 0;
  data.nameEn = data.nameEn || data.name;

  const handleSubmit = (values) => {
    values.established = values.established.format("YYYY-MM-DD");
    values.coordinates = {
      type: "Point",
      coordinates: values.coordinates.coordinates
        .toString()
        .split(",")
        .map((val) => +val),
    };

    setUpdating(true);

    updateMuseum(query.id as string, values)
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
        name="museum"
        {...formItemLayout}
        onFinish={handleSubmit}
        initialValues={data}
      >
        <Form.Item
          label="中文名称"
          name="name"
          rules={[{ required: true, message: "请输入博物馆中文名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="英文名称"
          name="nameEn"
          rules={[{ required: true, message: "请输入博物馆英文名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="照片"
          name="photoUrl"
          rules={[{ required: true, message: "请上传博物馆头像" }]}
        >
          <PictureField />
        </Form.Item>
        <Form.Item
          label="wiki链接"
          name="wikiLink"
          rules={[{ required: true, message: "维基百科博物馆主页" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="创建日期"
          name="established"
          rules={[{ required: true, message: "请输入博物馆创建日期" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="国家"
          name="country"
          rules={[{ required: true, message: "请输入博物馆所在国家" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="位于"
          name="location"
          rules={[{ required: true, message: "请输入博物馆所在城市" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="坐标"
          name={["coordinates", "coordinates"]}
          rules={[{ required: true, message: "请输入博物馆坐标" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: "请输入博物馆简介" }]}
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
