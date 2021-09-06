import React from "react";
import { Select } from "antd";

interface Field {
  value?: any;
  onChange?: () => void;
}

export default function ObjectTypeSelect({ value, onChange, ...props }: Field) {
  const types = ["绘画", "雕塑"];
  const options = types.map((item) => ({ label: item, value: item }));

  return (
    <Select
      {...props}
      value={value}
      placeholder="请选择艺术类型"
      style={{ minWidth: 200 }}
      filterOption={false}
      showSearch
      onSelect={onChange}
      options={options}
    />
  );
}
