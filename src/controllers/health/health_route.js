import { Router } from 'express'
import { getHealthStatus } from '#src/controllers/health/health_controller'

const healthRouter = Router()

healthRouter.get('/check', getHealthStatus)

export default healthRouter
