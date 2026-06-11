import ShoppingList from '../models/ShoppingList.js'

function normalizeItems(items = []) {
  return items
    .map((item) => ({
      nome: item.nome?.trim(),
      comprado: Boolean(item.comprado),
    }))
    .filter((item) => item.nome)
}

function isListOwner(list, userId) {
  return list.usuario?.toString() === userId?.toString()
}

function sendNotFound(res) {
  res.status(404).json({ message: 'Lista de compras não encontrada.' })
}

function sendForbidden(res) {
  res.status(403).json({ message: 'Apenas o dono pode alterar esta lista.' })
}

function validatePayload({ nome, itens }, res) {
  const normalizedName = nome?.trim()
  const normalizedItems = normalizeItems(itens)

  if (!normalizedName || normalizedItems.length === 0) {
    res.status(400).json({ message: 'Nome da lista e pelo menos um item são obrigatórios.' })
    return null
  }

  return {
    nome: normalizedName,
    itens: normalizedItems,
  }
}

export async function createShoppingList(req, res) {
  const payload = validatePayload(req.body, res)

  if (!payload) return

  const shoppingList = await ShoppingList.create({
    ...payload,
    usuario: req.user._id,
  })

  res.status(201).json({ shoppingList })
}

export async function listShoppingLists(req, res) {
  const shoppingLists = await ShoppingList.find({ usuario: req.user._id }).sort({ createdAt: -1 })

  res.json({ shoppingLists })
}

export async function getShoppingListById(req, res) {
  const shoppingList = await ShoppingList.findById(req.params.id)

  if (!shoppingList) {
    sendNotFound(res)
    return
  }

  if (!isListOwner(shoppingList, req.user._id)) {
    sendForbidden(res)
    return
  }

  res.json({ shoppingList })
}

export async function updateShoppingList(req, res) {
  const shoppingList = await ShoppingList.findById(req.params.id)

  if (!shoppingList) {
    sendNotFound(res)
    return
  }

  if (!isListOwner(shoppingList, req.user._id)) {
    sendForbidden(res)
    return
  }

  const payload = validatePayload(req.body, res)

  if (!payload) return

  shoppingList.nome = payload.nome
  shoppingList.itens = payload.itens

  const updatedShoppingList = await shoppingList.save()

  res.json({ shoppingList: updatedShoppingList })
}

export async function deleteShoppingList(req, res) {
  const shoppingList = await ShoppingList.findById(req.params.id)

  if (!shoppingList) {
    sendNotFound(res)
    return
  }

  if (!isListOwner(shoppingList, req.user._id)) {
    sendForbidden(res)
    return
  }

  await shoppingList.deleteOne()

  res.status(204).send()
}
