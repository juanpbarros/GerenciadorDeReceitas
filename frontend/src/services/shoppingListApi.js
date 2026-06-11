import { apiClient } from './apiClient'

export function normalizeShoppingList(shoppingList) {
  return {
    id: shoppingList._id || shoppingList.id,
    name: shoppingList.nome,
    items: (shoppingList.itens || []).map((item) => ({
      id: item._id || item.id,
      name: item.nome,
      purchased: Boolean(item.comprado),
    })),
    createdAt: shoppingList.createdAt,
    updatedAt: shoppingList.updatedAt,
  }
}

function toApiPayload(shoppingList) {
  return {
    nome: shoppingList.name,
    itens: shoppingList.items.map((item) => ({
      nome: item.name,
      comprado: item.purchased,
    })),
  }
}

export async function listShoppingListsRequest() {
  const response = await apiClient.get('/shopping-lists')

  return {
    shoppingLists: response.data.shoppingLists.map(normalizeShoppingList),
  }
}

export async function createShoppingListRequest(shoppingList) {
  const response = await apiClient.post('/shopping-lists', toApiPayload(shoppingList))

  return {
    shoppingList: normalizeShoppingList(response.data.shoppingList),
  }
}

export async function updateShoppingListRequest(id, shoppingList) {
  const response = await apiClient.patch(`/shopping-lists/${id}`, toApiPayload(shoppingList))

  return {
    shoppingList: normalizeShoppingList(response.data.shoppingList),
  }
}

export async function deleteShoppingListRequest(id) {
  await apiClient.delete(`/shopping-lists/${id}`)
}
