import { Router } from 'express'
import {
  createShoppingList,
  deleteShoppingList,
  getShoppingListById,
  listShoppingLists,
  updateShoppingList,
} from '../controllers/shoppingListController.js'
import { authenticate } from '../middlewares/authMiddleware.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const router = Router()

router.use(authenticate)

router.get('/', asyncHandler(listShoppingLists))
router.post('/', asyncHandler(createShoppingList))
router.get('/:id', asyncHandler(getShoppingListById))
router.patch('/:id', asyncHandler(updateShoppingList))
router.delete('/:id', asyncHandler(deleteShoppingList))

export default router
