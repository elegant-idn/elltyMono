export const capitalize = (str: string) => {
  // Check if the string is empty or already capitalized
  if (str.length === 0 || str[0] === str[0].toUpperCase()) {
    return str.toString();
  }

  // Capitalize the first character and concatenate with the rest of the string
  return str.charAt(0).toUpperCase() + str.slice(1);
};
