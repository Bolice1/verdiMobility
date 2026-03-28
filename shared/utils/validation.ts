export const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,128}$/;

export function isValidEmail(email: string) {
  return emailPattern.test(email.trim());
}

export function isStrongPassword(password: string) {
  return strongPasswordPattern.test(password);
}

export function getPasswordRuleStatus(password: string) {
  return {
    minLength: password.length >= 10,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z\d]/.test(password),
  };
}
