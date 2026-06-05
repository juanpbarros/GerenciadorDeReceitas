import mongoose from 'mongoose'

export const RECIPE_CATEGORIES = [
  'Café da manhã',
  'Almoço',
  'Jantar',
  'Sobremesa',
  'Massas',
  'Bebidas',
  'Saladas',
  'Lanches',
]

const recipeSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descricao: {
      type: String,
      required: true,
      trim: true,
    },
    ingredientes: {
      type: [String],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'A receita deve possuir pelo menos um ingrediente.',
      },
    },
    modoPreparo: {
      type: [String],
      required: true,
      validate: {
        validator: (steps) => Array.isArray(steps) && steps.length > 0,
        message: 'A receita deve possuir pelo menos uma etapa de preparo.',
      },
    },
    tempoPreparo: {
      type: Number,
      required: true,
      min: 1,
    },
    categoria: {
      type: String,
      required: true,
      enum: RECIPE_CATEGORIES,
    },
    imagemUrl: {
      type: String,
      trim: true,
      default: '',
    },
    usuarioCriador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema)

export default Recipe
