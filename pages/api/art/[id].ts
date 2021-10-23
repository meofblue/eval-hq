import { NextApiRequest, NextApiResponse } from "next";
import { db } from "cloud";

export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "POST") {
    await db
      .collection("arts")
      .doc(id as string)
      .update(req.body);

    res.status(200).json({
      data: {
        ...req.body,
        _id: id,
      },
    });
  } else {
    const { data } = await db
      .collection("arts")
      .doc(id as string)
      .get();

    const { thumbnail, tileDir, originalUrl, ...rest } = data[0];

    if (data.length > 0) {
      res.status(200).json({
        ...rest,
        tileDir: `${process.env.CDN_ENDPOINT}/${tileDir}`,
        thumbnail: `${process.env.CDN_ENDPOINT}/${thumbnail}`,
        originalUrl: `${process.env.CDN_ENDPOINT}/${originalUrl}`,
      });
    } else {
      res.status(404);
    }
  }
}
