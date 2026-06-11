import mongoose from 'mongoose'

const favoriteSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  },
)

favoriteSchema.index({ usuario: 1, receita: 1 }, { unique: true })

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema)

export default Favorite
