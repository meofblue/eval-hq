import type { NextApiRequest, NextApiResponse } from "next";
import { omitBy, isNil } from "lodash";
import { $, db } from "cloud";

/** 支持复杂筛选 */
export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    name,
    artist,
    museum,
    public: open,
    current = 1,
    pageSize = 20,
  } = req.query;

  const query = omitBy(
    {
      artist,
      museum,
      name: name ? new RegExp(`${name}`, "i") : undefined,
      public: !!open ? true : undefined,
    },
    isNil
  );

  const cmd = db.collection("arts").aggregate().match(query);

  const { total } = await db.collection("arts").where(query).count();

  const { data } = await cmd
    .skip((+current - 1) * +pageSize)
    .limit(+pageSize)
    .lookup({
      from: "artists",
      localField: "artist",
      foreignField: "_id",
      as: "artist",
    })
    .lookup({
      from: "museums",
      localField: "museum",
      foreignField: "_id",
      as: "museum",
    })
    .replaceRoot({
      newRoot: $.mergeObjects([
        "$$ROOT",
        {
          artist: $.arrayElemAt(["$artist", 0]),
          museum: $.arrayElemAt(["$museum", 0]),
        },
      ]),
    })
    .end();

  res.status(200).json({
    pagination: {
      current: +current,
      pageSize: +pageSize,
      total,
    },
    data: data.map(item => ({
      ...item,
      thumbnail: `${process.env.CDN_ENDPOINT}/${item.thumbnail}`,
      originalUrl: `${process.env.CDN_ENDPOINT}/${item.originalUrl}`,
    })),
  });
}
