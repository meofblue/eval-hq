import type { NextApiRequest, NextApiResponse } from "next";
import { cos, db } from "cloud";
import { uuid } from "uuidv4";
import { extname } from "path";
import { tmpdir } from "os";
import {
  createReadStream,
  mkdirSync,
  readdirSync,
  rmdirSync,
  copyFileSync,
} from "fs";
import sharp from "sharp";

/** 支持复杂筛选 */
export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data } = await db
    .collection("arts")
    .doc(req.query.id as string)
    .get();

  res.status(200).json(data);

  if (data[0].tileDir) {
    return;
  }

  const filePath = "/Users/xuhong/iDev/art/datuv/starry_night.jpg";

  try {
    const ext = extname(filePath);
    const tmpDir = `${tmpdir()}/eval_${uuid()}`;
    const filename = `${uuid()}${ext}`;
    const tmpFilePath = `${tmpDir}/${filename}`;
    console.log(tmpDir);
    mkdirSync(tmpDir);
    copyFileSync(filePath, tmpFilePath);

    const { width, height } = await sharp(tmpFilePath, {
      limitInputPixels: false,
    })
      .tile({ size: 512 })
      .toFile(`${tmpDir}/output.dz`);

    const tileDir = `${tmpDir}/output_files`;
    const dirs = readdirSync(tileDir);
    const validDirs = dirs
      .filter((i) => {
        const files = readdirSync(`${tileDir}/${i}`);
        return files.length > 1;
      })
      .map((i) => +i);

    validDirs.push(Math.min(...validDirs) - 1);

    const tileKey = uuid();
    console.log(tileKey);
    for (let dir of validDirs) {
      const files = readdirSync(`${tileDir}/${dir}`);
      for (let file of files) {
        console.log(`${dir}/${file}`);
        await cos.putObject({
          Bucket: "eval-1253419855",
          Region: "ap-shanghai",
          Key: `/tiles/${tileKey}/${dir}/${file}`,
          Body: createReadStream(`${tileDir}/${dir}/${file}`),
        });
      }
    }

    await cos.putObject({
      Bucket: "eval-1253419855",
      Region: "ap-shanghai",
      Key: `/arts/original/${filename}`,
      Body: createReadStream(tmpFilePath),
    });

    const buffer = await sharp(tmpFilePath, {
      limitInputPixels: false,
    })
      .resize({ width: 800, fit: "contain" })
      .toBuffer();

    await cos.putObject({
      Bucket: "eval-1253419855",
      Region: "ap-shanghai",
      Key: `/arts/thumbnail/${filename}`,
      Body: buffer,
    });

    rmdirSync(tmpDir, { recursive: true });

    const { _id: id, ...rest } = data[0];

    await db
      .collection("arts")
      .doc(id as string)
      .update({
        ...rest,
        imageWidth: width,
        imageHeight: height,
        originalUrl: `/arts/original/${filename}`,
        thumbnail: `/arts/thumbnail/${filename}`,
        tileDir: `/tiles/${tileKey}/`,
      });
  } catch (err) {
    console.log(err);
  }
}
