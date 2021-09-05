import React from "react";
import { Button, Col, Form, Row } from "antd";
import styles from "./index.module.css";

interface FieldItem {
  span: number;
  label: string;
  name: string;
  itemProps?: any;
  fieldProps?: any;
  Field: React.ComponentClass | React.FunctionComponent<any>;
}

interface FilterProps {
  fields: FieldItem[];
  initialValues?: any;
  onSubmit: (val: any) => void;
}

const Filter = ({ initialValues, onSubmit, fields }: FilterProps) => {
  const [form] = Form.useForm();

  return (
    <Form
      className={styles.filter}
      form={form}
      onFinish={onSubmit}
      initialValues={initialValues}
    >
      <Row gutter={24}>
        {fields.map((field) => (
          <Col key={field.name} span={field.span}>
            <Form.Item
              label={field.label}
              name={field.name}
              {...field.itemProps}
            >
              <field.Field {...field.fieldProps} />
            </Form.Item>
          </Col>
        ))}
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              form.resetFields();
              onSubmit({});
            }}
          >
            清空
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
