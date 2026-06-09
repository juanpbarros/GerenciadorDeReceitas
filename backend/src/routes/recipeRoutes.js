import { Router } from 'express'
import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  listRecipes,
  updateRecipe,
} from '../controllers/recipeController.js'
import { authenticate } from '../middlewares/authMiddleware.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const router = Router()

router.use(authenticate)

router.get('/', asyncHandler(listRecipes))
router.post('/', asyncHandler(createRecipe))
router.get('/:id', asyncHandler(getRecipeById))
router.patch('/:id', asyncHandler(updateRecipe))
router.delete('/:id', asyncHandler(deleteRecipe))

export default router
