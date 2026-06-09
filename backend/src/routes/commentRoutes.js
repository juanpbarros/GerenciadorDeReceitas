import { Router } from 'express'
import {
  createComment,
  deleteComment,
  getComment,
  listComments,
  updateComment,
} from '../controllers/commentController.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', asyncHandler(listComments))
router.get('/:id', asyncHandler(getComment))
router.post('/', authenticate, asyncHandler(createComment))
router.put('/:id', authenticate, asyncHandler(updateComment))
router.delete('/:id', authenticate, asyncHandler(deleteComment))

export default router
