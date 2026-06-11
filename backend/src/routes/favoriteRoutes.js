import { Router } from 'express'
import {
  addFavorite,
  listFavorites,
  removeFavorite,
} from '../controllers/favoriteController.js'
import { authenticate } from '../middlewares/authMiddleware.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const router = Router()

router.use(authenticate)

router.get('/', asyncHandler(listFavorites))
router.post('/:recipeId', asyncHandler(addFavorite))
router.delete('/:recipeId', asyncHandler(removeFavorite))

export default router
