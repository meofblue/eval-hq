import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "cloud";

/** 支持复杂筛选 */
export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, public: isPublic, current = 1, pageSize = 20 } = req.query;
  let query: any = {};
  if (name) {
    query.name = new RegExp(`${name}`, "i");
  }
  if (isPublic === "true") {
    query.public = true;
  }
  
  const cmd = db.collection("museums").where(query);

  const { total } = await cmd.count();

  const { data } = await cmd
    .limit(+pageSize)
    .skip((+current - 1) * +pageSize)
    .get();

  res.status(200).json({
    pagination: {
      current: +current,
      pageSize: +pageSize,
      total,
    },
    data,
  });
}
