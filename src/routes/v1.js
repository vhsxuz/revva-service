import employeeRouter from "#src/controllers/employee/employee_route"
import healthRouter from "#src/controllers/health/health_route"
import menuRouter from "#src/controllers/menu/menu_route"
import transactionRouter from "#src/controllers/transaction/transaction_router"
import userRouter from "#src/controllers/user/user_route"
import { Router } from 'express'

export const router = Router()

router.use('/health', healthRouter)
router.use('/menu', menuRouter)
router.use('/user', userRouter)
router.use('/employee', employeeRouter)
router.use('/transaction', transactionRouter)

export default router