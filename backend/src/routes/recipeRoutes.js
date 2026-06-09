import { Router } from 'express'
import { createRecipe, listRecipes } from '../controllers/recipeController.js'
import { authenticate } from '../middlewares/authMiddleware.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const router = Router()

router.use(authenticate)

router.get('/', asyncHandler(listRecipes))
router.post('/', asyncHandler(createRecipe))

export default router
