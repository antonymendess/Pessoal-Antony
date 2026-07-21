import { Cliente, ClienteAPI } from './classes.js';
import {
  validarNome,
  validarEmail,
  buscarClientePorId,
  contarClientes,
  ordenarPorNome,
} from './utils.js';

const API_URL = 'https://crudcrud.com/api/6db2abcd422543ceb45f085f76924b80/clientes';
const api = new ClienteAPI(API_URL);

const form = document.getElementById('clienteForm');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const listaClientes = document.getElementById('listaClientes');
const mensagemDiv = document.getElementById('mensagem');
const totalClientesSpan = document.getElementById('totalClientes');

let clientes = [];

function mostrarMensagem(texto, tipo) {
  mensagemDiv.textContent = texto;
  mensagemDiv.className = `mensagem ${tipo}`;
  setTimeout(() => {
    mensagemDiv.textContent = '';
    mensagemDiv.className = 'mensagem';
  }, 3000);
}

function criarItemCliente(cliente) {
  const li = document.createElement('li');

  const info = document.createElement('div');
  info.className = 'cliente-info';
  info.innerHTML = `<strong>${cliente.nome}</strong><span>${cliente.email}</span>`;

  const botaoExcluir = document.createElement('button');
  botaoExcluir.textContent = 'Excluir';
  botaoExcluir.className = 'btn-excluir';
  botaoExcluir.addEventListener('click', () => excluirCliente(cliente.id));

  li.appendChild(info);
  li.appendChild(botaoExcluir);
  return li;
}

function renderizarClientes() {
  listaClientes.innerHTML = '';

  if (clientes.length === 0) {
    listaClientes.innerHTML = '<li>Nenhum cliente cadastrado.</li>';
  } else {
    ordenarPorNome(clientes).forEach((cliente) => {
      listaClientes.appendChild(criarItemCliente(cliente));
    });
  }

  totalClientesSpan.textContent = contarClientes(clientes);
}

async function carregarClientes() {
  try {
    clientes = await api.listar();
    renderizarClientes();
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao carregar clientes.', 'erro');
  }
}

async function cadastrarCliente(nome, email) {
  try {
    const novoCliente = await api.criar(new Cliente(nome, email));
    clientes = [...clientes, novoCliente];
    renderizarClientes();
    mostrarMensagem('Cliente cadastrado com sucesso!', 'sucesso');
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao cadastrar cliente.', 'erro');
  }
}

async function excluirCliente(id) {
  const cliente = buscarClientePorId(clientes, id);
  if (!cliente) return;

  try {
    await api.excluir(id);
    clientes = clientes.filter((c) => c.id !== id);
    renderizarClientes();
    mostrarMensagem('Cliente excluído com sucesso!', 'sucesso');
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao excluir cliente.', 'erro');
  }
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();

  if (!validarNome(nome)) {
    mostrarMensagem('Nome deve ter ao menos 2 caracteres.', 'erro');
    return;
  }

  if (!validarEmail(email)) {
    mostrarMensagem('E-mail inválido.', 'erro');
    return;
  }

  cadastrarCliente(nome, email);
  form.reset();
  nomeInput.focus();
});

carregarClientes();
