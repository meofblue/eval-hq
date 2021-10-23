import React, { useState } from "react";
import { Select, Spin } from "antd";
import { useArtists } from "api";
import { useDebounce } from "hooks";

export default function ArtistSelect({
  value,
  onChange,
  ...props
}: Field) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const query = {
    id: value,
    public: true,
    name: debouncedSearch,
  };
  if (!!search) {
    delete query.id;
  }
  const { data, error } = useArtists(query);
  let options = [];
  if (data && data.data) {
    options = data.data.map((item) => ({ label: item.name, value: item._id }));
  }

  return (
    <Select
      {...props}
      value={value}
      placeholder="请选择艺术家"
      style={{ minWidth: 200 }}
      filterOption={false}
      allowClear
      showSearch
      onSearch={setSearch}
      onSelect={onChange}
      onClear={onChange}
      notFoundContent={!data && !error ? <Spin size="small" /> : null}
      options={options}
    />
  );
}
