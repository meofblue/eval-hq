import type { NextApiRequest, NextApiResponse } from "next";
import { cos, db } from "cloud";
import { pullAll } from "lodash";

const mediumMap = {
  "oil on canvas": "油画",
};

const objectTypeMap = {
  painting: "绘画",
};

/** 支持复杂筛选 */
export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let allImages = [];
  let hasMore = true;
  let marker;

  while (hasMore) {
    const { Contents, NextMarker } = await cos.getBucket({
      Bucket: "eval-1253419855",
      Region: "ap-shanghai",
      Prefix: "arts/original/",
      MaxKeys: 1000,
      Marker: marker,
    });

    allImages = allImages.concat(Contents);

    if (NextMarker) {
      marker = NextMarker;
    } else {
      hasMore = false;
    }
  }

  // allImages = allImages.map((item) => item.Prefix)

  const { current = 1, artist, pageSize = 1000 } = req.query;
  let query: any = {};
  if (artist) {
    query.artist = artist;
  }
  const cmd = db.collection("arts").where(query);

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

  all = all.filter((item) => item.originalUrl && !item.imageSize);

  for (let item of all) {
    const { _id: id, ...rest } = item;

    await db
      .collection("arts")
      .doc(id)
      .update({
        ...rest,
        imageSize: +allImages.find((img) => img.Key === item.originalUrl).Size,
      });
  }

  res.status(200).json("ok");
}
