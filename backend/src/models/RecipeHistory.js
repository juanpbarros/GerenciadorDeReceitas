import mongoose from 'mongoose'

const recipeHistorySchema = new mongoose.Schema(
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
    data: {
      type: Date,
      required: true,
    },
    observacao: {
      type: String,
      trim: true,
      default: '',
    },
    notaPessoal: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

const RecipeHistory = mongoose.models.RecipeHistory || mongoose.model('RecipeHistory', recipeHistorySchema)

export default RecipeHistory
