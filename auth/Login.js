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

      const loginStatus = await dbClient.db.collection('authentication_keys').findOne({ workId });

      if (loginStatus)
      {
        return res.status(409).json({ error: `user with ${workId} is already logged on` });
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

    async getLoginTeller(req, res) {
      try {
        const { workCashierId, password } = req.body;

        const userExist = await dbClient.db.collection('tellerUsers').findOne({ workCashierId });
        
        if (!userExist) {
          console.log(`User doesn't exist`);
          return res.status(400).json({ error: `Cashier with ${workCashierId} does not exist` });
        }

        const checkPassword = await bcrypt.compare(password, userExist.password);
        if (!checkPassword) {
          console.log('wrong password');
          return res.status(400).json({ error: `Wrong password` });
        }

        const loginStatus = await dbClient.db.collection('authentication_keys').findOne({ workCashierId });

        if (loginStatus) {
          console.log(`Teller with ${workCashierId} is already loggen on`);
          return res.status(409).json({ error: `Teller with ${workCashierId} is already loggen on` });
        }

        const auth_teller_keypass = uuidv4();
        const store_authkp = await dbClient.db.collection('authentication_keys').insertOne({
          workCashierId,
          auth_teller_keypass,
          loggedInAt: new Date()
        });
        return res.status(200).json({ connected: `as ${userExist.fullNames}` });
      } catch(error) {
        console.error('error while signing in', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
}

const loginInst = new Login();
export default loginInst;

