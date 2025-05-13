import { Router } from 'express';
import { getUserByFirebaseCreds, getPeopleIReferred, register } from '#src/controllers/user/user_controller';

const userRouter = Router();

userRouter.get('/firebase/:firebase_uid', getUserByFirebaseCreds);
userRouter.get('/my-referrals/:referrer_id', getPeopleIReferred);
userRouter.post('/register', register);

export default userRouter;