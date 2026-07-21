const API_URL = 'https://crudcrud.com/api/6db2abcd422543ceb45f085f76924b80/clientes';

const form = document.getElementById('clienteForm');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const listaClientes = document.getElementById('listaClientes');
const mensagemDiv = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo) {
  mensagemDiv.textContent = texto;
  mensagemDiv.className = `mensagem ${tipo}`;
  setTimeout(() => {
    mensagemDiv.textContent = '';
    mensagemDiv.className = 'mensagem';
  }, 3000);
}

async function listarClientes() {
  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) {
      throw new Error(`Erro ao buscar clientes: ${resposta.status}`);
    }
    const clientes = await resposta.json();
    renderizarClientes(clientes);
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao carregar clientes.', 'erro');
  }
}

function renderizarClientes(clientes) {
  listaClientes.innerHTML = '';

  if (clientes.length === 0) {
    listaClientes.innerHTML = '<li>Nenhum cliente cadastrado.</li>';
    return;
  }

  clientes.forEach((cliente) => {
    const li = document.createElement('li');

    const info = document.createElement('div');
    info.className = 'cliente-info';
    info.innerHTML = `<strong>${cliente.nome}</strong><span>${cliente.email}</span>`;

    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.className = 'btn-excluir';
    botaoExcluir.addEventListener('click', () => excluirCliente(cliente._id));

    li.appendChild(info);
    li.appendChild(botaoExcluir);
    listaClientes.appendChild(li);
  });
}

async function cadastrarCliente(nome, email) {
  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email }),
    });

    if (!resposta.ok) {
      throw new Error(`Erro ao cadastrar cliente: ${resposta.status}`);
    }

    mostrarMensagem('Cliente cadastrado com sucesso!', 'sucesso');
    await listarClientes();
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao cadastrar cliente.', 'erro');
  }
}

async function excluirCliente(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!resposta.ok) {
      throw new Error(`Erro ao excluir cliente: ${resposta.status}`);
    }

    mostrarMensagem('Cliente excluído com sucesso!', 'sucesso');
    await listarClientes();
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Erro ao excluir cliente.', 'erro');
  }
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();

  if (!nome || !email) {
    mostrarMensagem('Preencha nome e e-mail.', 'erro');
    return;
  }

  cadastrarCliente(nome, email);
  form.reset();
  nomeInput.focus();
});

listarClientes();
