import React from "react";
import { Select } from "antd";

interface Field {
  value?: any;
  onChange?: () => void;
}

export default function PaintTypeSelect({ value, onChange, ...props }: Field) {
  const types = ["肖像画", "人体画", "寓言画", "风景画", "插画", "城景画"];
  const options = types.map((item) => ({ label: item, value: item }));

  return (
    <Select
      {...props}
      value={value}
      placeholder="请选择绘画类型"
      style={{ minWidth: 200 }}
      filterOption={false}
      showSearch
      onSelect={onChange}
      options={options}
    />
  );
}
