import dbClient from '../storage/mongodbconnect.js';
import login from '../auth/Login.js';

class Logout {
  async getLogout(req, res) {
    try {
      const { workId, workCashierId } = req.body;

      if (workId) {
        const findLoggedUser = await dbClient.db.collection('authentication_keys').findOne({ workId });
        if (!findLoggedUser) {
          return res.status(400).json({User: 'Not found'});
        }

        const del_authkeycode = await dbClient.db.collection('authentication_keys').deleteOne({ workId });

        if (!del_authkeycode) {
          return res.status(400).json({error: 'wrong user or does not exist'});
        }
        return res.status(200).json({success: 'logged out'});
      } catch (error) {
        return res.status(500).json({error: 'check the logs for arised error'});
      }

      if (workCashierId) {
        const findLoggedUser = await dbClient.db.collection('authentication_keys').findOne({ workCashierId });
        if (!findLoggedUser) {
          return res.status(400).json({Teller: 'Not found'});
        }

        const del_authkeycode = await dbClient.db.collection('authentication_keys').deleteOne({ workCashierId });

        if (!del_authkeycode) {
          return res.status(400).json({error: 'wrong user or does not exist'});
        }
        return res.status(200).json({success: 'logged out'});
      } catch (error) {
        return res.status(500).json({error: 'check the logs for arised error'});
      }
  }
}

const logoutInst = new Logout();
export default logoutInst;
