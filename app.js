import express from 'express';
import  dotenv from 'dotenv';
import routes from './routes/index.js';
import multer from 'multer';

dotenv.config();
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json())
app.use(upload.single('fileUpload'));

const PORT = process.env.PORT

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`App running at port ${PORT}`)
});
