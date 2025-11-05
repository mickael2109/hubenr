

export const truncateToWords = (str: string, maxWords: number) => {
  const words = str.trim().split(/\s+/);
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(" ") + " ...";
};

