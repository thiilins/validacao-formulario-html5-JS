/**
 * Pensando em um código que possa ser reaproveitado e tendo em vista
 * os recursos, criaremos uma função 'genérica' que servira para validar todos os campos
 * e abaixo um objeto onde conterá o dataSet do input e especificando qual função acionar
 */

export function valida(input) {
  const inputType = input.dataset.type;
  const divPai = input.parentElement;
  const spanErro = input.parentElement.querySelector(".input-mensagem-erro");
  if (validadores[inputType]) {
    validadores[inputType](input);
  }

  if (input.validity.valid) {
    divPai.classList.remove("input-container--invalido");
    spanErro.textContent = "";
  } else {
    divPai.classList.add("input-container--invalido");
    spanErro.textContent = mostrarMsgErro(inputType, input);
  }
}
const validadores = {
  dataNascimento: (input) => validaNascimento(input),
};

/**
 * Estrutura de mensagens de erro global
 */
const mensagensDeErro = {
  nome: { valueMissing: "O campo nome não pode estar em branco" },
  email: {
    valueMissing: "O campo  e-mail não pode estar em branco",
    typeMismatch: "O e-mail digitado não é válido!",
  },
  senha: {
    valueMissing: "O campo senha não pode estar em branco ",
    patternMisMatch:
      "A Senha deve conter entre 8 á 12 caracteres e pelo menos 1 letra minuscula, 1 letra maiuscula e um número",
  },
  dataNascimento: {
    valueMissing: "O campo data de nascimento não pode estar em branco",
    customError: "Você deve ser maior de 18 anos para se cadastrar",
  },
  cpf: {
    valueMissing: "O campo CPF não pode estar em branco",
  },
};
const tiposDeErros = [
  "valueMissing",
  "typeMismatch",
  "patternMisMatch",
  "customError",
];

function mostrarMsgErro(inputType, input) {
  let mensagem = "";
  tiposDeErros.forEach((erro) => {
    if (input.validity[erro]) {
      mensagem = mensagensDeErro[inputType][erro];
    }
  });
  return mensagem;
}

/**
 * Validação de Data de nascimento e maioridade
 */
 
function validaNascimento(input) {
  //Transformar a String em Data
  const dataRecebida = new Date(input.value);
  let mensagem = "";
  if (!maiorDeIdade(dataRecebida)) {
    mensagem = "Você deve ser maior de 18 anos para se cadastrar";
  }

  return input.setCustomValidity(mensagem);
}
function maiorDeIdade(data) {
  //Criando a data de Hoje
  const dataAtual = new Date();
  //Tratando a data recebida para verificar se é maior de 18
  const dataMais18 = new Date(
    data.getUTCFullYear() + 18,
    data.getUTCMonth(),
    data.getUTCDate()
  );

  //validando
  return dataMais18 <= dataAtual;
}
