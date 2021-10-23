import React from "react";
import { Select } from "antd";

export default function MediumSelect({ value, onChange, ...props }: Field) {
  const types = ["油画", "水彩画", "钢笔画", "壁画"];
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
