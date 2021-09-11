import { useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  notification,
} from "antd";
import moment from "moment";
import Head from "components/head";
import { Error, Loading } from "components/index";
import { useArtist, updateArtist } from "api";

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

export default function Artist() {
  const [updating, setUpdating] = useState(false);
  const { query } = useRouter();

  const { data, error } = useArtist(query.id as string);

  if (error) return <Error />;
  if (!data) return <Loading />;

  data.locationOfBirth = data.locationOfBirth || data.locationOfBirthDeath[0];
  data.locationOfDeath = data.locationOfDeath || data.locationOfBirthDeath[1];

  data.dateOfBirth = data.dateOfBirth
    ? moment(data.dateOfBirth)
    : moment(data.dateOfBirthDeath[0]);

  data.dateOfDeath = data.dateOfDeath
    ? moment(data.dateOfDeath)
    : moment(data.dateOfBirthDeath[1]);

  data.nameEn = data.nameEn || data.name;

  const handleSubmit = (values) => {
    values.dateOfBirth = values.dateOfBirth.format("YYYY-MM-DD");
    values.dateOfDeath = values.dateOfDeath.format("YYYY-MM-DD");
    values.dateOfBirthDeath = null;
    values.movement = values.movement
      ? values.movement.toString().split(",")
      : [];

    setUpdating(true);

    updateArtist(query.id as string, values)
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
          label="中文姓名"
          name="name"
          rules={[{ required: true, message: "请输入艺术家中文名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="英文姓名"
          name="nameEn"
          rules={[{ required: true, message: "请输入艺术家英文名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="头像"
          name="photoUrl"
          rules={[{ required: true, message: "请上传艺术家头像" }]}
        >
          <PictureField />
        </Form.Item>
        <Form.Item
          label="wiki链接"
          name="wikiLink"
          rules={[{ required: true, message: "维基百科艺术家主页" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="出生日期"
          name="dateOfBirth"
          rules={[{ required: true, message: "请输入艺术家出生日期" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="死亡日期"
          name="dateOfDeath"
          rules={[{ required: true, message: "请输入艺术家死亡日期" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="风格"
          name="style"
          // rules={[{ required: true, message: "请输入艺术家风格" }]}
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
          rules={[{ required: true, message: "请输入艺术家国籍" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="出生地"
          name="locationOfBirth"
          rules={[{ required: true, message: "请输入艺术家出生地" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="死亡地"
          name="locationOfDeath"
          rules={[{ required: true, message: "请输入艺术家死亡地" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: "请输入艺术家简介" }]}
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
