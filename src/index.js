import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Router from '#src/routes/v1';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());

app.get('/', async (req, res, next) => {
  return res.status(200).send({ msg: 'Hello World' });
});

app.use('/api/v1', Router);

app.listen(port, async () => {
  console.log(`[+] Server Running on Port ${port}`);
});