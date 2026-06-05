import { Router } from 'express'
import { login, me, register } from '../controllers/authController.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/register', asyncHandler(register))
router.post('/login', asyncHandler(login))
router.get('/me', authenticate, me)

export default router
