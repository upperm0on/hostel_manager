export const toNetFromGross = (gross, rate = 0.04) => {
  const n = parseFloat(gross);
  if (isNaN(n)) return 0;
  const net = n / (1 + rate);
  return Math.round(net * 100) / 100;
};

export const toGrossFromNet = (net, rate = 0.04) => {
  const n = parseFloat(net);
  if (isNaN(n)) return 0;
  const gross = n * (1 + rate);
  return Math.round(gross * 100) / 100;
};
