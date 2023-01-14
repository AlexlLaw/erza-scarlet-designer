export interface ValidatorResult {
  valid: boolean;
  errorMessage: string;
}

export function validator(mask: string, value: any, currentErrorMessage?: string): ValidatorResult {
  let result: ValidatorResult = { valid: false, errorMessage: currentErrorMessage || '' };

  switch (mask) {
    case 'CPF':
      result = validCPF(value);
      break;
    case 'CNPJ':
      result = validCNPJ(value);
      break;
    case 'CPFCNPJ':
      result = validaCPFCNPJ(value);
      break;

    default:
      break;
  }
  return result;
}

function validaCPFCNPJ(value: string): ValidatorResult {
  if (value.length <= 14) {
    return validCPF(value);
  } else {
    return validCNPJ(value);
  }
}

function validCNPJ(value: string): ValidatorResult {
  if (!value) return { valid: false, errorMessage: '' };
  // Aceita receber o valor como string, número ou array com todos os dígitos
  const validTypes = typeof value === 'string' || Number.isInteger(value) || Array.isArray(value);

  // Elimina valores com formato inválido
  if (!validTypes) return { valid: false, errorMessage: '' };

  // Guarda todos os dígitos em um array
  // const numbers = value.toString().match(/\d/g).map(Number);

  let errorMessage = 'CNPJ Inválido';

  // Guarda um array com todos os dígitos do valor
  const match = value.toString().match(/\d/g);
  const numbers = match.map(Number);

  // Valida a quantidade de dígitos
  if (numbers.length !== 14) return { valid: false, errorMessage };

  // Elimina inválidos com todos os dígitos iguais
  const items = [...new Set(numbers)];
  if (items.length === 1) return { valid: false, errorMessage };

  // Cálculo validador
  const calc = x => {
    const slice = numbers.slice(0, x);
    let factor = x - 7;
    let sum = 0;

    for (let i = x; i >= 1; i--) {
      const n = slice[x - i];
      sum += n * factor--;
      if (factor < 2) factor = 9;
    }

    const res = 11 - (sum % 11);

    return res > 9 ? 0 : res;
  };

  // Separa os 2 últimos dígitos de verificadores
  const digits = numbers.slice(12);

  // Valida 1o. dígito verificador
  const digit0 = calc(12);
  if (digit0 !== digits[0]) return { valid: false, errorMessage };

  // Valida 2o. dígito verificador
  const digit1 = calc(13);

  let result = digit1 === digits[1];

  errorMessage = result ? '' : errorMessage;

  return { valid: result, errorMessage };
}

function validCPF(value: string): ValidatorResult {
  if (!value) return { valid: false, errorMessage: '' };

  // Aceita receber o valor como string, número ou array com todos os dígitos
  const validTypes = typeof value === 'string' || Number.isInteger(value) || Array.isArray(value);

  // Elimina valores com formato inválido
  if (!validTypes) return { valid: false, errorMessage: '' };

  // Guarda todos os dígitos em um array
  let numbersArr = value.toString().match(/\d/g).map(Number);

  let errorMessage = 'CPF Inválido';

  // Valida quantidade de dígitos
  if (numbersArr.length !== 11) return { valid: false, errorMessage };

  // Elimina valores inválidos com todos os dígitos repetidos
  const items = [...new Set(numbersArr)];
  if (items.length === 1) return { valid: false, errorMessage };

  // Separa número base do dígito verificador
  const base = numbersArr.slice(0, 9);
  const digits = numbersArr.slice(9);

  // Cálculo base
  const calc = (n, i, x) => n * (x - i);

  // Utilitário de soma
  const sum = (r, n) => r + n;

  // Cálculo de dígito verificador
  const digit = n => {
    const rest = n % numbersArr.length;
    return rest < 2 ? 0 : numbersArr.length - rest;
  };

  // Cálculo sobre o número base
  const calc0 = base.map((n, i) => calc(n, i, numbersArr.length - 1)).reduce(sum, 0);
  // 1o. dígito verificador
  const digit0 = digit(calc0);

  // Valida 1o. digito verificador
  if (digit0 !== digits[0]) return { valid: false, errorMessage };

  // Cálculo sobre o número base + 1o. dígito verificador
  const calc1 = base
    .concat(digit0)
    .map((n, i) => calc(n, i, numbersArr.length))
    .reduce(sum, 0);
  // 2o. dígito verificador
  const digit1 = digit(calc1);

  // Valida 2o. dígito verificador
  let result = digit1 === digits[1];

  errorMessage = result ? '' : errorMessage;

  return { valid: result, errorMessage };
}
