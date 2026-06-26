export const INDIAN_BANKS = [
  { id: 'sbi', bin: '4591', bank: 'State Bank of India', color: 'linear-gradient(135deg, #0083b0, #00b4db)', type: 'master card' },
  { id: 'hdfcv', bin: '4242', bank: 'HDFC Bank', color: 'linear-gradient(135deg, #002244, #0055a5)', type: 'visa' },
  { id: 'rupay', bin: '6071', bank: 'RuPay', color: 'linear-gradient(135deg, #311b92, #512da8)', type: 'rupay' },
];

export const getBankDetails = (num) => {
  const cleanNum = num.replace(/\D/g, '');
  return INDIAN_BANKS.find(b => cleanNum.startsWith(b.bin)) || 
         { bank: 'Indian Bank', color: '#333', type: 'visa' };
};