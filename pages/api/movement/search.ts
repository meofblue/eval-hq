import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "cloud";
import { isNil, omitBy } from "lodash";

/** 支持复杂筛选 */
export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, public: open, current = 1, pageSize = 20 } = req.query;

  const query = omitBy(
    {
      _id: !!id ? id : undefined,
      name: !!name ? new RegExp(`${name}`, "i") : undefined,
      public: !!open ? true : undefined,
    },
    isNil
  );

  const cmd = db.collection("movements").where(query);

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
