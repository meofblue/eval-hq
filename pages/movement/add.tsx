import { useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  notification,
} from "antd";
import Head from "components/head";
import { updateMovement } from "api";
import { PeriodSelect } from "components/fields";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

export default function AddMovement() {
  const [updating, setUpdating] = useState(false);
  const { query } = useRouter();

  const handleSubmit = (values) => {
    setUpdating(true);

    updateMovement(query.id as string, values)
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
      <Form name="movement" {...formItemLayout} onFinish={handleSubmit}>
        <Form.Item
          label="流派名称"
          name="name"
          rules={[{ required: true, message: "请输入流派中文名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="开始世纪"
          name="startCentury"
          rules={[{ required: true, message: "请输入开始世纪" }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="开始世纪阶段"
          name="startPeriod"
          rules={[{ required: true, message: "请输入开始世纪阶段" }]}
        >
          <PeriodSelect />
        </Form.Item>
        <Form.Item label="开始年份" name="startYear">
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="结束世纪"
          name="endCentury"
          rules={[{ required: true, message: "请输入结束世纪" }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="结束世纪阶段"
          name="endPeriod"
          rules={[{ required: true, message: "请输入结束世纪阶段" }]}
        >
          <PeriodSelect />
        </Form.Item>
        <Form.Item label="结束年份" name="endYear">
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: "请输入流派简介" }]}
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
