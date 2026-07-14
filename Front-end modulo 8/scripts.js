const STORAGE_KEY = "cadastro-usuario";

const form = document.getElementById("form-cadastro");
const campos = form.querySelectorAll("input");
const cepInput = document.getElementById("cep");
const cepStatus = document.getElementById("cep-status");
const mensagem = document.getElementById("mensagem");
const btnLimpar = document.getElementById("btn-limpar");

const enderecoInputs = {
  logradouro: document.getElementById("logradouro"),
  bairro: document.getElementById("bairro"),
  cidade: document.getElementById("cidade"),
  estado: document.getElementById("estado"),
};

function salvarNoStorage() {
  const dados = {};
  campos.forEach((campo) => {
    dados[campo.name] = campo.value;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

function restaurarDoStorage() {
  const dadosSalvos = localStorage.getItem(STORAGE_KEY);
  if (!dadosSalvos) return;

  const dados = JSON.parse(dadosSalvos);
  campos.forEach((campo) => {
    if (dados[campo.name] !== undefined) {
      campo.value = dados[campo.name];
    }
  });
}

function formatarCep(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 8);
  if (numeros.length > 5) {
    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
  }
  return numeros;
}

function definirStatus(texto, tipo) {
  cepStatus.textContent = texto;
  cepStatus.className = `status ${tipo || ""}`.trim();
}

async function buscarEnderecoPorCep(cep) {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    definirStatus("", "");
    return;
  }

  definirStatus("Buscando endereço...", "loading");

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (!resposta.ok) {
      throw new Error("Falha na requisição");
    }

    const dados = await resposta.json();

    if (dados.erro) {
      definirStatus("CEP não encontrado.", "error");
      return;
    }

    enderecoInputs.logradouro.value = dados.logradouro || "";
    enderecoInputs.bairro.value = dados.bairro || "";
    enderecoInputs.cidade.value = dados.localidade || "";
    enderecoInputs.estado.value = dados.uf || "";

    definirStatus("Endereço encontrado!", "success");
    salvarNoStorage();
    document.getElementById("numero").focus();
  } catch (erro) {
    definirStatus("Erro ao buscar o CEP. Tente novamente.", "error");
  }
}

cepInput.addEventListener("input", (evento) => {
  evento.target.value = formatarCep(evento.target.value);
});

cepInput.addEventListener("blur", (evento) => {
  buscarEnderecoPorCep(evento.target.value);
});

campos.forEach((campo) => {
  campo.addEventListener("input", salvarNoStorage);
});

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  salvarNoStorage();
  mensagem.textContent = "Cadastro salvo com sucesso!";
  setTimeout(() => {
    mensagem.textContent = "";
  }, 3000);
});

btnLimpar.addEventListener("click", () => {
  form.reset();
  localStorage.removeItem(STORAGE_KEY);
  definirStatus("", "");
  mensagem.textContent = "Dados limpos.";
  setTimeout(() => {
    mensagem.textContent = "";
  }, 3000);
});

document.addEventListener("DOMContentLoaded", restaurarDoStorage);
