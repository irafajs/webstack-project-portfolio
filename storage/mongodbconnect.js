import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class DBClient {
  constructor() {
    const host = process.env.HOST;
    const port = process.env.DB_PORT;
    const database = process.env.DATABASE_NAME || 'store_management_system';
    const uri = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(uri);

    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
      })
      .catch((err) => {
        console.error(err);
      });
  }

}

const dbClient = new DBClient();
export default dbClient;
