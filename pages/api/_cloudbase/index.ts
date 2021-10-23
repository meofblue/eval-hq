import { init } from "@cloudbase/node-sdk";
import COS from "cos-nodejs-sdk-v5";

export const app = init({
  secretId: process.env.CLOUDBASE_SECRET_ID,
  secretKey: process.env.CLOUDBASE_SECRET_KEY,
  env: process.env.CLOUDBASE_ENV,
});

export const db = app.database();
export const $ = db.command.aggregate;
export default app;

export const cos = new COS({
  SecretId: process.env.CLOUDBASE_SECRET_ID,
  SecretKey: process.env.CLOUDBASE_SECRET_KEY,
});