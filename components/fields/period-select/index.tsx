import React from "react";
import { Select } from "antd";

interface Field {
  value?: any;
  onChange?: (val: number) => void;
}

export default function PeriodSelect({ value, onChange, ...props }: Field) {
  const periods = ["早期", "中期", "后期"];
  const options = periods.map((item, index) => ({ label: item, value: index }));

  return (
    <Select
      {...props}
      value={value}
      placeholder="请选择时期"
      style={{ minWidth: 200 }}
      filterOption={false}
      onSelect={onChange}
      options={options}
    />
  );
}
