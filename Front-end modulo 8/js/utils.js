export function validarNome(nome) {
  return typeof nome === 'string' && nome.trim().length >= 2;
}

export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function buscarClientePorId(clientes, id) {
  return clientes.find((cliente) => cliente.id === id);
}

export function contarClientes(clientes) {
  return clientes.reduce((total) => total + 1, 0);
}

export function ordenarPorNome(clientes) {
  return [...clientes].sort((a, b) => a.nome.localeCompare(b.nome));
}
