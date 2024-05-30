import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import dbClient from '../storage/mongodbconnect.js';
import dotenv from 'dotenv';

dotenv.config();

const SUCCESS_PATH = path.resolve(process.env.FILE_SUCCESS_PATH);
const FAIL_PATH = path.resolve(process.env.FILE_FAILED_PATH);
const LOG_PATH = 'uploadslogs';

if (!fs.existsSync(SUCCESS_PATH)) {
  fs.mkdirSync(SUCCESS_PATH);
}

if (!fs.existsSync(FAIL_PATH)) {
  fs.mkdirSync(FAIL_PATH);
}

class CheckFileValid {
  constructor(successPath, failPath, logPath) {
    this.successPath = successPath;
    this.failPath = failPath;
    this.logPath = logPath;

    this.postFile = this.postFile.bind(this);
    this.isAdminLogged = this.isAdminLogged.bind(this);
    this.validateCSV = this.validateCSV.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.logToFile = this.logToFile.bind(this);
  }

  async isAdminLogged(workId) {
    return await dbClient.db.collection('authentication_keys').findOne({ workId });
  }

  validateCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      const errors = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const columns = Object.values(row);
          if (columns.length !== 6) {
            errors.push('Incorrect number of columns');
          } else {
            columns.forEach((col, index) => {
              if ([0, 3, 4, 5].includes(index) && /\s/.test(col)) {
                errors.push(`Row ${results.length + 1} Column ${index + 1} has spaces`);
              }
            });
          }
          results.push(row);
        })
        .on('end', () => {
          if (errors.length === 0) {
            resolve({ isValid: true, errors: null });
          } else {
            resolve({ isValid: false, errors });
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async saveFile(filePath, targetPath, logMessage = null) {
    const fileName = path.basename(filePath);
    const targetFilePath = path.join(targetPath, fileName);
    fs.renameSync(filePath, targetFilePath);

    if (logMessage) {
      fs.writeFileSync(path.join(targetPath, `${FileName}.log`), logMessage.join('\n'));
    }
  }

  logToFile(message) {
    const logEntry = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(this.logPath, logEntry, 'utf8');
  }

  async postFile(req, res) {
    try {
      const { workId } = req.body;
      const file = req.file;

      if (!await this.isAdminLogged(workId)) {
        const errorMessage = 'Admin must be logged in to upload files';
        this.logToFile(errorMessage);
        return res.status(400).json({ error: 'Authentication required' });
      }

      if (!file) {
        const errorMessage = 'Please upload the file';
        this.logToFile(errorMessage);
        return res.status(400).json({ error: 'File upload required' });
      }

      const filePath = file.path;
      const fileExtension = path.extname(file.originalname).toLowerCase();

      if (fileExtension !== '.csv') {
        fs.unlinkSync(filePath);
        const errorMessage = 'File format must be .csv';
        this.logToFile(errorMessage);
        return res.status(400).json({ error: 'Invalid file format' });
      }

      const { isValid, errors } = await this.validateCSV(filePath);

      if (isValid) {
        await this.saveFile(filePath, this.successPath);
        const successMessage = 'File successfully processed';
        this.logToFile(successMessage);
        return res.status(200).json({ message: 'File processed successfully' });
      } else {
        await this.saveFile(filePath, this.failPath, errors);
        const errorMessage = 'File failed validation';
        this.logToFile(`${errorMessage}: ${errors.join(', ')}`);
        return res.status(400).json({ message: `File validation failed` });
      }

    } catch (error) {
      const errorMessage = `Internal Server Error: ${error.message}`;
      this.logToFile(errorMessage);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

const checkFileValid = new CheckFileValid(SUCCESS_PATH, FAIL_PATH, LOG_PATH);
export default checkFileValid;
