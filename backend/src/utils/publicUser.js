export function toPublicUser(user) {
  return {
    _id: user._id.toString(),
    nome: user.nome,
    email: user.email,
  }
}
