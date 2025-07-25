export const formatDateForCV = (dateString) => {
  if (!dateString) return '';
  return dateString;
};

export const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

export const isValidPhoneNumber = (phone) => {
  // Basic check: starts with +, then 10-15 digits.
  return /^\+\d{10,15}$/.test(phone.replace(/\s/g, ''));
};

export const isValidLinkedInUrl = (url) => {
  return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(\/|\/?)$/i.test(url);
};

export const isValidGitHubUrl = (url) => {
  return /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/|\/?)$/i.test(url);
};
