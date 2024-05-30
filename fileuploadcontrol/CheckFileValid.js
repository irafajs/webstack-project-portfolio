import fs from 'fs'
import dbClient from '../storage/mongodbconnect.js';

import dotenv from 'dotenv';

dotenv.config();

const SUCCESS_PATH = process.env.FILE_SUCCESS_PATH;
if (!fs.existsSync(SUCCESS_PATH)) {
  fs.mkdirSync(SUCCESS_PATH);
}

const FAIL_PATH = process.env.FILE_FAILED_PATH;

if (!fs.existsSync(FAIL_PATH)) {
  fs.mkdirSync(FAIL_PATH);
}

class CheckFileValid {

