import bcrypt from 'bcrypt';
import dbClient from '../storage/mongodbconnect.js';

class CashierUsers {
  async postNewCashier(req, res) {
    try{
      const { workId, fullNames, email, password } = req.body;

      const isAdminlogged = await dbClient.db.collection('authentication_keys').findOne({ workId });

      if (!isAdminlogged) {
        return res.status(400).json({error: 'login to create a cachier'});
      }

      if (!workId || !fullNames || !email || !password) {
        return res.status(400).json({error: 'All field are required'});
      }

      const collections = await dbClient.db.listCollections({ name: 'tellerUsers' }).toArray();
      if (collections.length === 0) {
        await dbClient.db.createCollection('tellerUsers');
      }

      const checkUser = await dbClient.db.collection('tellerUsers').findOne({ email });

      if (checkUser) {
        return res.status(409).json({error: `Cashier with ${email} already exist`});
      }

      const hashingPassword = await bcrypt.hash(password, 10);

      const lastUser = await dbClient.db.collection('tellerUsers')
      .find().sort({ _id: -1 }).limit(1).toArray();

      let workCashierId = 'T0001';

      if (lastUser.length > 0) {
        const lastId = lastUser[0].workCashierId;
        const numericPart = parseInt(lastId.slice(1)) + 1;
        workCashierId = `T${numericPart.toString().padStart(4, '0')}`;
      }

      const insertUser = await dbClient.db.collection('tellerUsers').insertOne({
        fullNames,
        email,
        password: hashingPassword,
        workCashierId,
        createdAt: new Date(),
        createdBy: workId
      });

      return res.status(201).json(`Cashier: with ID ${workCashierId} created successfull`)
    } catch (error) {
      console.error('Error creating cashier:', error);
      return res.status(500).json({error: 'Internal Server error' });
    }
  }
}

const cashierUsers = new CashierUsers();
export default cashierUsers;
