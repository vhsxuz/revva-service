import { Router } from 'express';
import {
  getAllTransactions,
  getTransactionById,
  createTransaction
} from '#src/controllers/transaction/transaction_controller';

const transactionRouter = Router();

transactionRouter.get('/', getAllTransactions);
transactionRouter.get('/:id', getTransactionById);
transactionRouter.post('/', createTransaction);

export default transactionRouter;