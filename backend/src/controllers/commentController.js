import mongoose from 'mongoose'
import Comment from '../models/Comment.js'
import Recipe from '../models/Recipe.js'

function isValidId(id) {
  return mongoose.isValidObjectId(id)
}

function getOwnerId(comment) {
  return comment.usuario?._id?.toString?.() || comment.usuario?.toString?.()
}

function normalizeComment(comment) {
  const data = comment.toObject ? comment.toObject() : comment

  return {
    _id: data._id,
    usuario: data.usuario,
    receita: data.receita,
    texto: data.texto,
    nota: data.nota,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

function validateCommentPayload({ texto, nota }, { partial = false } = {}) {
  const errors = []

  if (!partial || texto !== undefined) {
    if (!texto?.trim()) {
      errors.push('Texto do comentario e obrigatorio.')
    }
  }

  if (!partial || nota !== undefined) {
    const rating = Number(nota)

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      errors.push('Nota deve ser um numero inteiro entre 1 e 5.')
    }
  }

  return errors
}

export async function listComments(req, res) {
  const { receita } = req.query
  const filter = {}

  if (receita) {
    if (!isValidId(receita)) {
      res.status(400).json({ message: 'Id da receita invalido.' })
      return
    }

    filter.receita = receita
  }

  const comments = await Comment.find(filter).sort({ createdAt: -1 })

  res.status(200).json({ comments: comments.map(normalizeComment) })
}

export async function getComment(req, res) {
  const { id } = req.params

  if (!isValidId(id)) {
    res.status(400).json({ message: 'Id do comentario invalido.' })
    return
  }

  const comment = await Comment.findById(id)

  if (!comment) {
    res.status(404).json({ message: 'Comentario nao encontrado.' })
    return
  }

  res.status(200).json({ comment: normalizeComment(comment) })
}

export async function createComment(req, res) {
  const { receita, texto, nota } = req.body

  if (!receita || !isValidId(receita)) {
    res.status(400).json({ message: 'Id da receita invalido.' })
    return
  }

  const errors = validateCommentPayload({ texto, nota })

  if (errors.length > 0) {
    res.status(400).json({ message: errors[0] })
    return
  }

  const recipe = await Recipe.findById(receita)

  if (!recipe) {
    res.status(404).json({ message: 'Receita nao encontrada.' })
    return
  }

  const comment = await Comment.create({
    usuario: req.user._id,
    receita,
    texto: texto.trim(),
    nota: Number(nota),
  })

  res.status(201).json({ comment: normalizeComment(comment) })
}

export async function updateComment(req, res) {
  const { id } = req.params
  const { texto, nota } = req.body

  if (!isValidId(id)) {
    res.status(400).json({ message: 'Id do comentario invalido.' })
    return
  }

  if (texto === undefined && nota === undefined) {
    res.status(400).json({ message: 'Informe texto ou nota para atualizar.' })
    return
  }

  const errors = validateCommentPayload({ texto, nota }, { partial: true })

  if (errors.length > 0) {
    res.status(400).json({ message: errors[0] })
    return
  }

  const comment = await Comment.findById(id)

  if (!comment) {
    res.status(404).json({ message: 'Comentario nao encontrado.' })
    return
  }

  if (getOwnerId(comment) !== req.user._id) {
    res.status(403).json({ message: 'Apenas o autor pode editar este comentario.' })
    return
  }

  if (texto !== undefined) {
    comment.texto = texto.trim()
  }

  if (nota !== undefined) {
    comment.nota = Number(nota)
  }

  await comment.save()

  res.status(200).json({ comment: normalizeComment(comment) })
}

export async function deleteComment(req, res) {
  const { id } = req.params

  if (!isValidId(id)) {
    res.status(400).json({ message: 'Id do comentario invalido.' })
    return
  }

  const comment = await Comment.findById(id)

  if (!comment) {
    res.status(404).json({ message: 'Comentario nao encontrado.' })
    return
  }

  if (getOwnerId(comment) !== req.user._id) {
    res.status(403).json({ message: 'Apenas o autor pode remover este comentario.' })
    return
  }

  await comment.deleteOne()

  res.status(204).send()
}
