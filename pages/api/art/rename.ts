import type { NextApiRequest, NextApiResponse } from "next";
import { cos, db } from "cloud";

/** 支持复杂筛选 */
export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { current = 1, artist, pageSize = 1000 } = req.query;
  let query: any = {};
  if (artist) {
    query.artist = artist;
  }
  const cmd = db.collection("museums").where(query);

  const { total } = await cmd.count();

  let all = [];

  const pages = new Array(Math.ceil(total / 1000)).fill(1).map((_, i) => i);

  for (let i of pages) {
    const { data } = await cmd
      .limit(+pageSize)
      .skip(i * +pageSize)
      .get();

    all = all.concat(data);
  }

  res.status(200).json(pages);

  for (let item of all) {
    const { _id: id, ...rest } = item;

    try {
      await db.collection("museums").doc(id).update(rest);
    } catch (err) {
      console.error(err);
    }
  }
  console.log("done");
}
