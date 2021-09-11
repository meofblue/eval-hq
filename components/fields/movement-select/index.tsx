import React, { useState } from "react";
import { Select, Spin } from "antd";
import { useMovements } from "api";
import { useDebounce } from "hooks";

interface Field {
  value?: any;
  onChange?: (val) => void;
}

export default function MovementSelect({ value, onChange, ...props }: Field) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const query = {
    id: value,
    name: debouncedSearch,
  };
  if (!!search) {
    delete query.id;
  }
  const { data, error } = useMovements(query);
  let options = [];
  if (data && data.data) {
    options = data.data.map((item) => ({ label: item.name, value: item._id }));
  }

  return (
    <Select
      {...props}
      value={value}
      placeholder="请选择艺术流派"
      style={{ minWidth: 200 }}
      filterOption={false}
      showSearch
      onSearch={setSearch}
      onSelect={onChange}
      notFoundContent={!data && !error ? <Spin size="small" /> : null}
      options={options}
    />
  );
}
