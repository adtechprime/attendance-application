/**
 * Currency and Document Formatting Utilities
 */

/**
 * Converts a number to Indian Currency words (e.g. 18500 -> "Eighteen Thousand Five Hundred Rupees Only")
 */
export function numberToIndianWords(num) {
  const n = Math.floor(Math.abs(Number(num) || 0));
  if (n === 0) return "Zero Rupees Only";

  const units = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  function convertTwoDigits(val) {
    if (val < 20) return units[val];
    const unit = val % 10;
    const ten = Math.floor(val / 10);
    return `${tens[ten]} ${units[unit]}`.trim();
  }

  function convertThreeDigits(val) {
    const hundred = Math.floor(val / 100);
    const rest = val % 100;
    let str = "";
    if (hundred > 0) {
      str += `${units[hundred]} Hundred`;
      if (rest > 0) str += " and ";
    }
    if (rest > 0) {
      str += convertTwoDigits(rest);
    }
    return str.trim();
  }

  let words = "";

  const crore = Math.floor(n / 10000000);
  let remainder = n % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  const hundred = remainder;

  if (crore > 0) {
    words += `${convertTwoDigits(crore)} Crore `;
  }

  if (lakh > 0) {
    words += `${convertTwoDigits(lakh)} Lakh `;
  }

  if (thousand > 0) {
    words += `${convertTwoDigits(thousand)} Thousand `;
  }

  if (hundred > 0) {
    words += `${convertThreeDigits(hundred)} `;
  }

  return `${words.trim()} Rupees Only`;
}

/**
 * Formats a Date to a human readable Indian format (e.g. 20 Aug 2026)
 */
export function formatIndianDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
