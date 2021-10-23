import { NextApiRequest, NextApiResponse } from "next";
import { db } from "cloud";

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = await db.collection("museums").add(req.body);

  res.status(200).json({
    ...req.body,
    _id: id,
  });
}
