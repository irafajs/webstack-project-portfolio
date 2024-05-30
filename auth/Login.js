import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import dbClient from '../storage/mongodbconnect.js';

class Login {
  async getLogin(req, res) {
    try {
      const { workId, password } = req.body;
      
      const checkUser = await dbClient.db.collection('adminusers').findOne({ workId });
      
      if (!checkUser) {
        console.log(`User with workId ${workId} does not exist`);
        return res.status(400).json({ error: `User with ${workId} does not exist` });
      }

      const checkPassword = await bcrypt.compare(password, checkUser.password);
      
      if (!checkPassword) {
        console.log('Password mismatch');
        return res.status(400).json({ error: 'Wrong password' });
      }

      const auth_keypass = uuidv4();
      const store_authkp = await dbClient.db.collection('authentication_keys').insertOne({
        workId,
        auth_keypass,
        createdAt: new Date()
      });

      return res.status(200).json({ connected: `as ${checkUser.fullNames}` });
    } catch (error) {
      console.error('Error while signing in', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

const loginInst = new Login();
export default loginInst;

