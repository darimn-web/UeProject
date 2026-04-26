export const parseBudget = (budgetStr: string): number => {
  const clean = budgetStr.replace('€', '').replace(' ', '').toLowerCase();
  const value = parseFloat(clean);
  if (clean.includes('billion') || clean.includes('b')) return value * 1000;
  return value;
};
