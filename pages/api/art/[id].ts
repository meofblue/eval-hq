import { NextApiRequest, NextApiResponse } from "next";
import app, { db } from "cloud";

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

    if (data.length > 0) {
      const { fileList } = await app.getTempFileURL({
        fileList: data[0].photo.toString().split(","),
      });
      data[0].photoUrl = fileList[0].tempFileURL;
      res.status(200).json(data[0]);
    } else {
      res.status(404);
    }
  }
}
