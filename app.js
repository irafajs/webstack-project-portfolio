import express from 'express';
import  dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();
const app = express();
app.use(express.json())

const PORT = process.env.PORT

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`App running at port ${PORT}`)
});
