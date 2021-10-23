import React from "react";
import { InputNumber, Select, Space } from "antd";

function PeriodSelect({ value, onChange, ...props }: Field) {
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

export default function MovementTimeField({ value = {}, onChange }: Field) {
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
        placeholder="世纪"
        onChange={(val) => handleChange({ century: val })}
      />
      <PeriodSelect
        value={value.period}
        onChange={(val) => handleChange({ period: val })}
      />
      <InputNumber
        value={value.year}
        placeholder="年份"
        onChange={(val) => handleChange({ year: val })}
      />
    </Space>
  );
}
