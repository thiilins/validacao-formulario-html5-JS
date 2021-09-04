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
  cpf: (input) => validaCPF(input),
  cep: (input) => recuperarCep(input),
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
    patternMismatch: "CPF inválido, por favor verifique os dados inseridos",
    customError: "CPF inválido, por favor verifique os dados inseridos",
  },
  cep: {
    valueMissing: "O campo CEP não pode estar em branco",
    patternMismatch: "CEP inválido, por favor verifique os dados inseridos",
    customError: "Não foi possível localizar o CEP inserido.",
  },
  logradouro: {
    valueMissing: "O campo logradouro não pode estar em branco",
  },
  cidade: {
    valueMissing: "O campo estado não pode estar em branco",
  },
  estado: {
    valueMissing: "O campo estado não pode estar em branco",
  },
  preco: {
    valueMissing: "O campo preço não pode estar em branco",
  },
};
const tiposDeErros = [
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
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
function validaCPF(input) {
  if (input.value.length > 0) {
    const cpfFormatado = input.value.replace(/\D/g, "");
    let mensagem = "";
    if (
      !verificarCPFRepetido(cpfFormatado) ||
      !verificarEstruturaCPF(cpfFormatado)
    ) {
      mensagem = "CPF inválido, por favor verifique os dados inseridos";
    }
    input.setCustomValidity(mensagem);
  }
}
function verificarCPFRepetido(cpf) {
  const dadosRepetidos = [
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
    "00000000000",
  ];
  let valido = true;
  dadosRepetidos.forEach((valor) => {
    if (valor == cpf) {
      valido = false;
    }
  });
  return valido;
}

function verificarEstruturaCPF(cpf) {
  const multiplicador = 10;
  return verificarDigito(cpf, multiplicador);
}
function verificarDigito(cpf, multiplicador) {
  //Caso os dois digitos tenham sido validados encerra e retorna válido
  if (multiplicador >= 12) {
    return true;
  }
  //Salvando o multiplicador para usar no laço de repetição
  let multiplicadorInicial = multiplicador;
  let soma = 0;
  //Retirando o digito e transformando num array
  const cpfSemDigito = cpf.substring(0, multiplicador - 1).split("");
  //Recolhendo o digito verificador que será testado
  const digitoVerificador = cpf.charAt(multiplicador - 1);
  //Efetuando o calculo com cada um dos números necessários
  for (let i = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
    soma = soma + cpfSemDigito[i] * multiplicadorInicial;
    i++;
  }
  /**
   * Verificando validade, caso seja válido chamará novamente a
   * função para verificar o próximo digito, caso não finalizará!
   */
  if (digitoVerificador == confirmarDigito(soma)) {
    return verificarDigito(cpf, multiplicador + 1);
  }
  return false;
}
function confirmarDigito(soma) {
  let resto = (soma * 10) % 11;
  //Configurando caso o resto seja 10 ou 11 retornar como 0
  if (resto == 10 || resto == 11) resto = 0;

  return resto;
}

//
//
//
function recuperarCep(input) {
  const cep = input.value.replace(/\D/g, "");
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const options = {
    method: "GET",
    mode: "cors",
    headers: {
      "content-type": "application/json;charset=utf-8",
    },
  };
  if (!input.validity.patternMismatch && !input.validity.valueMissing) {
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.erro) {
          inserirDadosCEP({
            logradouro: "",
            localidade: "",
            uf: "",
          });
          input.setCustomValidity("Não foi possível localizar o CEP inserido.");
          return;
        } else {
          inserirDadosCEP(data);
          input.setCustomValidity("");
          return;
        }
      });
  }
}
function inserirDadosCEP(data) {
  const logradouroInput = document.querySelector("#logradouro");
  const cidadeInput = document.querySelector("#cidade");
  const estadoInput = document.querySelector("#estado");
  const { logradouro, localidade, uf } = data;
  logradouroInput.value = logradouro;
  cidadeInput.value = localidade;
  estadoInput.value = uf;
}
