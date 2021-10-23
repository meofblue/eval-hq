import type { NextApiRequest, NextApiResponse } from "next";
import { cos, db } from "cloud";
import { uuid } from "uuidv4";
import { extname } from "path";
import { tmpdir } from "os";
import {
  createReadStream,
  createWriteStream,
  mkdirSync,
  readdirSync,
  rmdirSync,
} from "fs";
import puppeteer from "puppeteer";
import sharp from "sharp";
import { getPalette } from "colorthief";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function download(url, filename) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();

  // https://github.com/puppeteer/puppeteer/issues/1599
  await (page as any)._client.send("Network.enable", {
    maxResourceBufferSize: 1024 * 1024 * 500,
    maxTotalBufferSize: 1024 * 1204 * 500,
  });

  page.on("response", async (response) => {
    if (response.request().resourceType() === "document") {
      response.buffer().then((file) => {
        const writeStream = createWriteStream(filename);
        writeStream.write(file);
      });
    }
  });

  await page.goto(url, { timeout: 0, waitUntil: "networkidle0" });
  await sleep(2000);
  await browser.close();
}

/** 支持复杂筛选 */
export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { current = 1, skip = 0, artist, pageSize = 1000 } = req.query;
  let query: any = {
    thumbnail: db.command.exists(false),
  };
  if (artist) {
    query.artist = artist;
  }
  const cmd = db.collection("arts").where(query);

  const { total } = await cmd.count();

  const { data } = await cmd
    .limit(+pageSize)
    .skip((+current - 1) * +pageSize + +skip)
    .get();

  res.status(200).json({ total });

  const items = data.filter((item) => !item.thumbnail);

  let i = 0;
  for (let item of items) {
    console.log(i++, item._id, items.length, item.fileLink);
    const tmpDir = `${tmpdir()}/eval_${uuid()}`;

    try {
      const ext = extname(item.fileLink);
      const filename = `${uuid()}${ext}`;
      const tmpFilePath = `${tmpDir}/${filename}`;

      mkdirSync(tmpDir);

      await download(item.fileLink, tmpFilePath);

      const { width, height } = await sharp(tmpFilePath, {
        limitInputPixels: false,
      }).metadata();

      let tileKey;

      if (width > 512) {
        await sharp(tmpFilePath, {
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

        if (validDirs.length === 0) return;

        validDirs.push(Math.min(...validDirs) - 1);

        tileKey = uuid();
        for (let dir of validDirs) {
          const files = readdirSync(`${tileDir}/${dir}`);
          for (let file of files) {
            await cos.putObject({
              Bucket: "eval-1253419855",
              Region: "ap-shanghai",
              Key: `/tiles/${tileKey}/${dir}/${file}`,
              Body: createReadStream(`${tileDir}/${dir}/${file}`),
            });
          }
        }
      }

      await cos.putObject({
        Bucket: "eval-1253419855",
        Region: "ap-shanghai",
        Key: `/arts/original/${filename}`,
        Body: createReadStream(tmpFilePath),
      });

      const thumbnailFilePath = `${tmpDir}/thumbnail${ext}`;
      await sharp(tmpFilePath, {
        limitInputPixels: false,
      })
        .resize({ width: Math.min(800, width), fit: "contain" })
        .toFile(thumbnailFilePath);

      await cos.putObject({
        Bucket: "eval-1253419855",
        Region: "ap-shanghai",
        Key: `/arts/thumbnail/${filename}`,
        Body: createReadStream(thumbnailFilePath),
      });

      let palette = [];
      try {
        palette = await getPalette(thumbnailFilePath, 5);
      } catch (err) {
        console.error(err);
      }

      const { _id: id, ...rest } = item;

      await db
        .collection("arts")
        .doc(id)
        .update({
          ...rest,
          imageWidth: width,
          imageHeight: height,
          originalUrl: `/arts/original/${filename}`,
          thumbnail: `/arts/thumbnail/${filename}`,
          tileDir: tileKey ? `/tiles/${tileKey}/` : undefined,
          palette,
        });
    } catch (err) {
      console.error(err);
      console.log("failed:", item._id, item.fileLink);
    } finally {
      rmdirSync(tmpDir, { recursive: true });
    }
  }
}
