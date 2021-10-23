import { useState } from "react";
import { Button, Checkbox, DatePicker, Form, Input, notification } from "antd";
import Head from "components/head";
import { Picture } from "components/fields";
import { createMuseum } from "api";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

export default function Museum() {
  const [updating, setUpdating] = useState(false);

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

    createMuseum(values)
      .then(() => {
        notification.success({
          message: "创建成功",
        });
      })
      .finally(() => setUpdating(false));
  };

  return (
    <div>
      <Head title="新增博物馆" />
      <Form
        name="museum"
        {...formItemLayout}
        onFinish={handleSubmit}
        initialValues={{}}
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
          // rules={[{ required: true, message: "请上传博物馆头像" }]}
        >
          <Picture />
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
