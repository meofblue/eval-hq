import React, { useMemo, useState } from "react";
import { Select, Spin } from "antd";
import { useMovements } from "api";
import { useDebounce } from "hooks";

export default function MovementSelect({ value, onChange, ...props }: Field) {
  const [id, setId] = useState(value);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  
  const query = useMemo(() => {
    if (debouncedSearch) {
      return { name: debouncedSearch };
    } else {
      return { id };
    }
  }, [debouncedSearch, id]);

  const { data, error } = useMovements(query);

  let options = [];
  if (data && data.data) {
    options = data.data.map((item) => ({ label: item.name, value: item._id }));
  }

  const handleClear = () => {
    setSearch("");
    setId("");
  };

  return (
    <Select
      {...props}
      defaultValue={value}
      placeholder="请选择艺术流派"
      style={{ minWidth: 200 }}
      filterOption={false}
      allowClear
      showSearch
      onSearch={setSearch}
      onSelect={onChange}
      onClear={handleClear}
      notFoundContent={!data && !error ? <Spin size="small" /> : null}
      options={options}
    />
  );
}
