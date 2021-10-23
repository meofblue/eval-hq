import React from "react";

export default function Picture({ value, ...rest }: Field) {
  return <img style={{maxWidth: 800}} src={value} {...rest} />;
}
