import accounting from "accounting";

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function formatPercent(percent: number): string {
  return `${accounting
    .formatMoney(percent, "", 1, ",", ".")
    .replace(/\.00$/g, "")}%`;
}

export function formatCurrency(value: number): string {
  return accounting.formatMoney(value, "$", 2, ",", ".").replace(/\.00$/g, "");
}

export function formatNumber(value: number): string {
  return accounting.formatMoney(value, "", 2, ",", ".").replace(/\.00$/g, "");
}

export function numberToWordsWithAnd(number) {
  const units = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "ten",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  function convertLessThanThousand(num) {
    if (num === 0) {
      return "";
    } else if (num < 10) {
      return units[num];
    } else if (num < 20) {
      return teens[num - 10];
    } else {
      const digit = num % 10;
      const ten = Math.floor(num / 10);
      return `${tens[ten]} ${units[digit]}`.trim();
    }
  }

  if (number === 0) {
    return "zero";
  }

  const billion = Math.floor(number / 1000000000);
  const million = Math.floor((number % 1000000000) / 1000000);
  const thousand = Math.floor((number % 1000000) / 1000);
  const remainder = number % 1000;

  let result = "";

  if (billion > 0) {
    result += `${convertLessThanThousand(billion)} billion `;
  }

  if (million > 0) {
    result += `${convertLessThanThousand(million)} million `;
  }

  if (thousand > 0) {
    result += `${convertLessThanThousand(thousand)} thousand `;
  }

  if (remainder > 0) {
    const remainderWords = convertLessThanThousand(remainder);

    // Add "and" if there are thousands or millions
    if ((billion > 0 || million > 0) && remainder < 100) {
      result += `and ${remainderWords}`;
    } else {
      result += remainderWords;
    }
  }

  return result.trim();
}
