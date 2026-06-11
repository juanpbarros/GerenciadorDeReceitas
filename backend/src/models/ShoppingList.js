import mongoose from 'mongoose'

const shoppingListItemSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    comprado: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
)

const shoppingListSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    itens: {
      type: [shoppingListItemSchema],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'A lista deve possuir pelo menos um item.',
      },
    },
  },
  {
    timestamps: true,
  },
)

const ShoppingList = mongoose.models.ShoppingList || mongoose.model('ShoppingList', shoppingListSchema)

export default ShoppingList
