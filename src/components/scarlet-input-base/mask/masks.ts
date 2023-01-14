export interface MaskResult {
  maskedValue: string;
  maxlength: number;
  unMaskValue?: any;
}

export function mask(tag: string, value: any): MaskResult {
  let maskedValue = '',  maxlength = 0, unMaskValue = '';
  switch (tag) {
      case 'CPF':
        value =  maskOnlyNumbers(value)
        maskedValue = maskCPF(value);
        maxlength = 14;
        break;

      case 'CNPJ':
        maskedValue = maskCNPJ(maskOnlyNumbers(value));
        maxlength = 18;
        break;

      case 'CPFCNPJ':
        value = maskOnlyNumbers(value);
        if (value.length <= 11) {
          maskedValue = maskCPF(value);
          maxlength = 14;
        } else {
          maskedValue = maskCNPJ(value);
          maxlength = 18;
        }
      break;

      case 'CEP':
        maskedValue = maskCEP(maskOnlyNumbers(value));

        maxlength = 9;
        break;

      case 'CURRENCY':
        maskedValue = maskCurrency(maskOnlyNumbers(value));
        maxlength = undefined;
        break;

      case 'DATE':
        maskedValue = maskDate(maskOnlyNumbers(value));
        maxlength = 10;
        break;

      case 'ALEATORYKEY':
        maskedValue = maskAleatoryKey(value);

        maxlength = 36;
        break;

      default:
        maskedValue = value;

        maxlength = undefined;
        break;
    }
  return { maskedValue, maxlength };
}

const maskCurrency = value => {
  const MAX_SAFE_VALUE = 999999999999999;

  const sanitizeCurrency = (currencyValue: string) => currencyValue.replace(' ', ' ');
  const isSafeValue = (safeValue: number) => safeValue >= Number(MAX_SAFE_VALUE * -1) && safeValue <= MAX_SAFE_VALUE;
  const options = {
    locale: 'pt-BR',
    minimumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL',
  };

  const moneyMask = (val: string): string => {
    const hasMinus = val.includes('-');

    val = val.replace('.', '').replace(',', '').replace(/\D/g, '').replace(/\W/g, '');

    /* istanbul ignore next */
    const signal = parseFloat(val) !== 0 && hasMinus ? '-' : '';
    let floatValue = parseFloat(signal + val);

    if (!isSafeValue(floatValue)) {
      floatValue = parseFloat(signal + MAX_SAFE_VALUE);
    }

    return sanitizeCurrency(new Intl.NumberFormat(options.locale, options).format(floatValue / Math.pow(10, 2)));
  };

  if (typeof value === 'string' && !value) return '';

  if (typeof value === 'string') {
    return moneyMask(value);
  }

  /* istanbul ignore next */
  return sanitizeCurrency(
    new Intl.NumberFormat(options.locale, {
      minimumFractionDigits: 2,
      style: 'currency',
      currency: 'BRL',
    }).format(value),
  );
};

// 000.000.000-00
const maskCPF = value => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+$/, '$1');
};

// 00.000.000/000-00
const maskCNPJ = value => {
  return value
    .replace(/^(\d{2})/, '$1.')
    .replace(/^(\d{2}.)(\d{3})/, '$1$2.')
    .replace(/^(\d{2}.)(\d{3}.)(\d{3})/, '$1$2$3/')
    .replace(/^(\d{2}.)(\d{3}.)(\d{3}\/)(\d{4})/, '$1$2$3$4-');
};

// 00000-000
const maskCEP = value => {
  return value.replace(/\D/g, '').replace(/^(\d{5})(\d{3})+$/, '$1-$2');
};

// 00/00/0000
const maskDate = value => {
  return value
    .replaceAll('-','/')
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})/, '$1');
};

// Aceita apenas números
const maskOnlyNumbers = value => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\D/g, '');
};

// a00a0000-0000-00a0-a000-a00000000aa0
const maskAleatoryKey = value => {
  if (typeof value !== 'string') {
    return '';
  }

  value = value.replace(/[^a-zA-Z0-9 ]/g, '');
  if (!value) {
    return '';
  }

  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20, 32)}`;
};
