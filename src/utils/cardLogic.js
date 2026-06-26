export const validateLuhn = (num) => {
  let digits = num.replace(/\D/g, '');
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let intVal = parseInt(digits[i]);
    if (i % 2 === digits.length % 2) {
      intVal *= 2;
      if (intVal > 9) intVal -= 9;
    }
    sum += intVal;
  }
  return sum % 10 === 0 && digits.length >= 13;
};

export const formatCardNumber = (value) => {
  return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
};

export const maskNumber = (num) => {
  const clean = num.replace(/\D/g, '');
  if (clean.length === 0) return '';
  
  let masked = '';
  for (let i = 0; i < clean.length; i++) {
    if (i < clean.length - 4) {
      masked += 'X';
    } else {
      masked += clean[i];
    }
  }
  return masked.replace(/(.{4})/g, '$1 ').trim();
};
