import React, { useMemo } from "react";
import COS from "cos-js-sdk-v5";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { uuid } from "uuidv4";

interface Uploader {
  value?: string;
  onChange?: (val: string) => void;
  prefix?: string;
}

export default function Uploader({ value, onChange, prefix = "" }) {
  const cos = useMemo(
    () =>
      new COS({
        getAuthorization: (options, callback) => {
          fetch("/api/upload/token")
            .then((res) => res.json())
            .then(({ credentials, startTime, expiredTime }) => {
              callback({
                TmpSecretId: credentials.tmpSecretId,
                TmpSecretKey: credentials.tmpSecretKey,
                SecurityToken: credentials.sessionToken,
                StartTime: startTime,
                ExpiredTime: expiredTime,
              });
            });
        },
      }),
    []
  );

  const handleChange = ({ fileList }) => {
    const file = fileList[0];
    const ext = file.name.slice(file.name.lastIndexOf("."));
    const fileKey = `${prefix}/${uuid()}${ext}`;

    cos
      .putObject({
        Bucket: "eval-1253419855",
        Region: "ap-shanghai",
        Key: fileKey,
        Body: fileList[0].originFileObj,
      })
      .then((data) => console.log(data));
  };

  return value ? (
    <img style={{ maxWidth: 400 }} src={value} />
  ) : (
    <Upload.Dragger beforeUpload={() => false} onChange={handleChange}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </Upload.Dragger>
  );
}
