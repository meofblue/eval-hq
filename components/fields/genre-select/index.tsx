import React from "react";
import { Select } from "antd";

export default function GenreSelect({ value, onChange, ...props }: Field) {
  const types = [
    "肖像画",
    "人体画",
    "寓言画",
    "静物画",
    "茶水画",
    "风景画",
    "插画",
    "城景画",
  ];
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
