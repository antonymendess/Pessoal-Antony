export class Cliente {
  constructor(nome, email, id = null) {
    this.nome = nome;
    this.email = email;
    this.id = id;
  }

  toPayload() {
    return { nome: this.nome, email: this.email };
  }
}

export class ClienteAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async listar() {
    const resposta = await fetch(this.baseUrl);
    if (!resposta.ok) {
      throw new Error(`Erro ao buscar clientes: ${resposta.status}`);
    }
    const dados = await resposta.json();
    return dados.map((item) => new Cliente(item.nome, item.email, item._id));
  }

  async criar(cliente) {
    const resposta = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente.toPayload()),
    });
    if (!resposta.ok) {
      throw new Error(`Erro ao cadastrar cliente: ${resposta.status}`);
    }
    const dados = await resposta.json();
    return new Cliente(dados.nome, dados.email, dados._id);
  }

  async excluir(id) {
    const resposta = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    if (!resposta.ok) {
      throw new Error(`Erro ao excluir cliente: ${resposta.status}`);
    }
  }
}
