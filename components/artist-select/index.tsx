import React, { useState } from "react";
import { Select, Spin } from "antd";
import { useArtists } from "api";
import { useDebounce } from "hooks";

interface Field {
  value?: any;
  onChange?: () => void;
}

export default function ArtistSelectField({
  value,
  onChange,
  ...props
}: Field) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const { data, error } = useArtists({ name: debouncedSearch });
  let options = [];
  if (data && data.data) {
    options = data.data.map((item) => ({ label: item.name, value: item._id }));
  }

  return (
    <Select
      {...props}
      placeholder="请选择艺术家"
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
