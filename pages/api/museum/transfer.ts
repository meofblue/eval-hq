import type { NextApiRequest, NextApiResponse } from "next";
import { app, db } from "cloud";

/** 支持复杂筛选 */
export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { current = 1, pageSize = 1000 } = req.query;

  const query = {};

  const cmd = db.collection("museums").where(query);

  const { total } = await cmd.count();

  const { data } = await cmd
    .limit(+pageSize)
    .skip((+current - 1) * +pageSize + 1)
    .get();

  for (let item of data) {
    if (Array.isArray(item.photo)) {
      const { fileList } = await app.getTempFileURL({
        fileList: item.photo.toString().split(","),
      });

      const photoUrl = fileList[0].tempFileURL.replace(
        "6576-eval-prod-7gv6nxkxd16c249d-1253419855.tcb.qcloud.la",
        "eval-1253419855.cos.ap-shanghai.myqcloud.com"
      );

      console.log(photoUrl);

      await fetch(fileList[0].tempFileURL);

      const { _id: id, ...rest } = item;

      await db
        .collection("museums")
        .doc(id)
        .update({
          ...rest,
          photo: item.photo
            .toString()
            .replace(
              "cloud://eval-prod-7gv6nxkxd16c249d.6576-eval-prod-7gv6nxkxd16c249d-1253419855",
              ""
            ),
          photoUrl,
        });
    }
  }

  res.status(200).json({
    pagination: {
      current: +current,
      pageSize: +pageSize,
      total,
    },
    data,
  });
}
