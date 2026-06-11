import { Router } from 'express'
import authRoutes from './authRoutes.js'
import commentRoutes from './commentRoutes.js'
import healthRoutes from './healthRoutes.js'
import recipeHistoryRoutes from './recipeHistoryRoutes.js'
import recipeRoutes from './recipeRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/comments', commentRoutes)
router.use('/health', healthRoutes)
router.use('/recipe-history', recipeHistoryRoutes)
router.use('/recipes', recipeRoutes)

export default router

