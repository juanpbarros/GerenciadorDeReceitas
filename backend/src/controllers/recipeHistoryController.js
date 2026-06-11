import mongoose from 'mongoose'
import Recipe from '../models/Recipe.js'
import RecipeHistory from '../models/RecipeHistory.js'

function isValidId(id) {
  return mongoose.isValidObjectId(id)
}

function getOwnerId(historyRecord) {
  return historyRecord.usuario?._id?.toString?.() || historyRecord.usuario?.toString?.()
}

function normalizeHistory(historyRecord) {
  const data = historyRecord.toObject ? historyRecord.toObject() : historyRecord

  return {
    _id: data._id,
    usuario: data.usuario,
    receita: data.receita,
    data: data.data,
    observacao: data.observacao || '',
    notaPessoal: data.notaPessoal ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

function validateHistoryPayload({ receita, data, observacao = '', notaPessoal }) {
  const errors = []

  if (!receita || !isValidId(receita)) {
    errors.push('Id da receita invalido.')
  }

  const parsedDate = data ? new Date(data) : null

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    errors.push('Data do historico invalida.')
  }

  const normalizedRating = notaPessoal === '' || notaPessoal === undefined || notaPessoal === null
    ? null
    : Number(notaPessoal)

  if (normalizedRating !== null && (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5)) {
    errors.push('Nota pessoal deve ser um numero inteiro entre 1 e 5.')
  }

  if (errors.length > 0) {
    return { errors }
  }

  return {
    errors,
    payload: {
      receita,
      data: parsedDate,
      observacao: observacao.trim(),
      notaPessoal: normalizedRating,
    },
  }
}

export async function listRecipeHistory(req, res) {
  const history = await RecipeHistory.find({ usuario: req.user._id })
    .populate('receita', 'titulo categoria tempoPreparo imagemUrl')
    .sort({ data: -1, createdAt: -1 })

  res.status(200).json({ history: history.map(normalizeHistory) })
}

export async function getRecipeHistoryById(req, res) {
  const { id } = req.params

  if (!isValidId(id)) {
    res.status(400).json({ message: 'Id do historico invalido.' })
    return
  }

  const historyRecord = await RecipeHistory.findById(id).populate('receita', 'titulo categoria tempoPreparo imagemUrl')

  if (!historyRecord) {
    res.status(404).json({ message: 'Registro de historico nao encontrado.' })
    return
  }

  if (getOwnerId(historyRecord) !== req.user._id) {
    res.status(403).json({ message: 'Apenas o dono pode acessar este historico.' })
    return
  }

  res.status(200).json({ historyRecord: normalizeHistory(historyRecord) })
}

export async function createRecipeHistory(req, res) {
  const { errors, payload } = validateHistoryPayload(req.body)

  if (errors.length > 0) {
    res.status(400).json({ message: errors[0] })
    return
  }

  const recipe = await Recipe.findById(payload.receita)

  if (!recipe) {
    res.status(404).json({ message: 'Receita não encontrada.' })
    return
  }

  const historyRecord = await RecipeHistory.create({
    ...payload,
    usuario: req.user._id,
  })

  res.status(201).json({ historyRecord: normalizeHistory(historyRecord) })
}

export async function updateRecipeHistory(req, res) {
  const { id } = req.params

  if (!isValidId(id)) {
    res.status(400).json({ message: 'Id do historico invalido.' })
    return
  }

  const historyRecord = await RecipeHistory.findById(id)

  if (!historyRecord) {
    res.status(404).json({ message: 'Registro de historico nao encontrado.' })
    return
  }

  if (getOwnerId(historyRecord) !== req.user._id) {
    res.status(403).json({ message: 'Apenas o dono pode alterar este historico.' })
    return
  }

  const { errors, payload } = validateHistoryPayload(req.body)

  if (errors.length > 0) {
    res.status(400).json({ message: errors[0] })
    return
  }

  const recipe = await Recipe.findById(payload.receita)

  if (!recipe) {
    res.status(404).json({ message: 'Receita não encontrada.' })
    return
  }

  Object.assign(historyRecord, payload)
  await historyRecord.save()

  res.status(200).json({ historyRecord: normalizeHistory(historyRecord) })
}

export async function deleteRecipeHistory(req, res) {
  const { id } = req.params

  if (!isValidId(id)) {
    res.status(400).json({ message: 'Id do historico invalido.' })
    return
  }

  const historyRecord = await RecipeHistory.findById(id)

  if (!historyRecord) {
    res.status(404).json({ message: 'Registro de historico nao encontrado.' })
    return
  }

  if (getOwnerId(historyRecord) !== req.user._id) {
    res.status(403).json({ message: 'Apenas o dono pode remover este historico.' })
    return
  }

  await historyRecord.deleteOne()

  res.status(204).send()
}
