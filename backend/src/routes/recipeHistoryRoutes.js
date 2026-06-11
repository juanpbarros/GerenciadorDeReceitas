import { Router } from 'express'
import {
  createRecipeHistory,
  deleteRecipeHistory,
  getRecipeHistoryById,
  listRecipeHistory,
  updateRecipeHistory,
} from '../controllers/recipeHistoryController.js'
import { authenticate } from '../middlewares/authMiddleware.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const router = Router()

router.use(authenticate)

router.get('/', asyncHandler(listRecipeHistory))
router.post('/', asyncHandler(createRecipeHistory))
router.get('/:id', asyncHandler(getRecipeHistoryById))
router.patch('/:id', asyncHandler(updateRecipeHistory))
router.delete('/:id', asyncHandler(deleteRecipeHistory))

export default router
