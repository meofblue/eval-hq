import { useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  notification,
  Space,
} from "antd";
import Head from "components/head";
import { Error, Loading } from "components/index";
import { useMovement, updateMovement } from "api";
import { PeriodSelect } from "components/fields";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

interface Field {
  value?: any;
  onChange?: (val) => void;
}

function TimeField({ value, onChange }: Field) {
  const handleChange = (val) => {
    onChange({
      ...value,
      ...val,
    });
  };

  return (
    <Space>
      <InputNumber
        value={value.century}
        onChange={(val) => handleChange({ century: val })}
      />
      <PeriodSelect
        value={value.period}
        onChange={(val) => handleChange({ period: val })}
      />
      <InputNumber
        value={value.year}
        onChange={(val) => handleChange({ year: val })}
      />
    </Space>
  );
}

export default function Movement() {
  const [updating, setUpdating] = useState(false);
  const { query } = useRouter();

  const { data, error } = useMovement(query.id as string);

  if (error) return <Error />;
  if (!data) return <Loading />;

  data.startTime = {
    century: data.startCentury,
    period: data.startPeriod,
    year: data.startYear,
  };

  data.endTime = {
    century: data.endCentury,
    period: data.endPeriod,
    year: data.endYear,
  };

  const handleSubmit = (values) => {
    setUpdating(true);

    values.startCentury = data.startTime.century;
    values.startPeriod = data.startTime.period;
    values.startYear = data.startTime.year;

    values.endCentury = data.endTime.century;
    values.endPeriod = data.endTime.period;
    values.endYear = data.endTime.year;

    delete values.startTime;
    delete values.endTime;

    updateMovement(query.id as string, values)
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
        name="movement"
        {...formItemLayout}
        onFinish={handleSubmit}
        initialValues={data}
      >
        <Form.Item
          label="流派名称"
          name="name"
          rules={[{ required: true, message: "请输入流派中文名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="开始时间"
          name="startTime"
          rules={[{ required: true, message: "请输入开始时间" }]}
        >
          <TimeField />
        </Form.Item>
        <Form.Item
          label="结束时间"
          name="endTime"
          rules={[{ required: true, message: "请输入结束时间" }]}
        >
          <TimeField />
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
