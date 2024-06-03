import express from 'express';
import AdminUser from '../users/AdminUser.js';
import CashierUsers from '../users/CashierUsers.js';
import Login from '../auth/Login.js';
import Logout from '../auth/Logout.js';
import checkFileValid from '../fileuploadcontrol/CheckFileValid.js';


const router = express.Router();

router.post('/adminusers', AdminUser.postNew);
router.post('/login', Login.getLogin);
router.post('/cashierlogin', Login.getLoginTeller);
router.post('/logout', Logout.getLogout);
router.post('/cashiers',CashierUsers.postNewCashier);
router.post('/fileupload', checkFileValid.postFile);

export default router;
