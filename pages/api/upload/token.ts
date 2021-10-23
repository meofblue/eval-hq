import { NextApiRequest, NextApiResponse } from "next";
import STS from "qcloud-cos-sts";

const config = {
  appId: "1253419855",
  region: "ap-shanghai",
  allowPrefix: "*",
  bucket: "eval-1253419855",
};

export default async function token(req: NextApiRequest, res: NextApiResponse) {
  const { credentials, startTime, expiredTime } = await STS.getCredential({
    secretId: process.env.CLOUDBASE_SECRET_ID,
    secretKey: process.env.CLOUDBASE_SECRET_KEY,
    policy: {
      version: "2.0",
      statement: [
        {
          action: [
            // 简单上传
            "name/cos:PutObject",
            "name/cos:PostObject",
            // 分片上传
            "name/cos:InitiateMultipartUpload",
            "name/cos:ListMultipartUploads",
            "name/cos:ListParts",
            "name/cos:UploadPart",
            "name/cos:CompleteMultipartUpload",
          ],
          effect: "allow",
          principal: { qcs: ["*"] },
          resource: [
            "qcs::cos:" +
              config.region +
              ":uid/" +
              config.appId +
              ":prefix//" +
              config.appId +
              "/" +
              config.allowPrefix,
          ],
        },
      ],
    },
  });

  res.status(200).json({
    credentials,
    startTime,
    expiredTime
  });
}
