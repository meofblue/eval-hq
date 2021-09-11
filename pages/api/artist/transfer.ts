import type { NextApiRequest, NextApiResponse } from "next";
import { app, db } from "cloud";

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/** 支持复杂筛选 */
export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { current = 1, pageSize = 1000 } = req.query;

  const query = {};

  const cmd = db.collection("artists").where(query);

  const { total } = await cmd.count();

  const { data } = await cmd
    .limit(+pageSize)
    .skip((+current - 1) * +pageSize + 1)
    .get();

  res.status(200).json({
    pagination: {
      current: +current,
      pageSize: +pageSize,
      total,
    },
    data,
  });

  for (let item of data) {
    const partial: any = {};
    if (Array.isArray(item.locationOfBirthDeath)) {
      partial.locationOfBirth = item.locationOfBirthDeath[0];
      partial.locationOfDeath = item.locationOfBirthDeath[1];
    }

    if (Array.isArray(item.dateOfBirthDeath)) {
      partial.dateOfBirth = item.dateOfBirthDeath[0];
      partial.dateOfDeath = item.dateOfBirthDeath[1];
    }

    const { _id: id, ...rest } = item;

    await db
      .collection("artists")
      .doc(id)
      .update({
        ...rest,
        ...partial,
      });
  }
}
