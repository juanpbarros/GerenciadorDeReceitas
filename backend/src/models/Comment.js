import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receita: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
    texto: {
      type: String,
      required: true,
      trim: true,
    },
    nota: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
)

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)

export default Comment
