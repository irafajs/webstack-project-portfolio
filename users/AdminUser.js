import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import dbClient from '../storage/mongodbconnect.js';

class AdminUser {
  static async postNew(req, res) {
    try {
      const { fullNames, email, password } = req.body;
      if (!fullNames || !email || !password) {
        return res.status(400).json({ error: 'please fill each field' });
      }

      if (password.length < 9) {
        return res.status(400).json({ error: 'password must be more than 9 character' });
      }

      const checkUser = await dbClient.db.collection('adminusers').findOne({ email });
      if (checkUser) {
        return res.status(400).json({ error: `${checkUser.email} already exist` });
      }

      const hashingPassword =  await bcrypt.hash(password, 10);
      const lastUser = await dbClient.db.collection('adminusers')
      .find({})
      .sort({ workId: -1 })
      .limit(1)
      .toArray();

      let workId = '0001';
      if (lastUser.length > 0 && lastUser[0].workId) {
        workId = (parseInt(lastUser[0].workId, 10) + 1).toString().padStart(4, '0');
      }

      const insertUser = await dbClient.db.collection('adminusers').insertOne({ 
        fullNames,
        email,
        password: hashingPassword,
        workId,
        createdAt: new Date(),
      });

      const newUser = {
        id: insertUser.insertedId,
        fullNames,
        email,
        workId
      };
      return res.status(201).json(`new user created with workid: ${newUser.workId}`);
    }
    catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server error' });
    }
  }
}

export default AdminUser;
