import { NextApiRequest, NextApiResponse } from "next";
import { db } from "cloud";

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(111, req.method, req.body);
  if (req.method === "post") {
    const { id } = await db.collection("movements").add(req.body);

    res.status(200).json({
      _id: id,
      ...req.body,
    });
  }

  res.status(200).json({})
}
