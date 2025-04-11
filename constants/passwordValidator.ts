interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  // Minimum 8 characters
  if (password.length < 10) {
    errors.push("Password must be at least 10 characters long.");
  }

  // At least one uppercase letter
//   if (!/[A-Z]/.test(password)) {
//     errors.push("Password must contain at least one uppercase letter.");
//   }

//   // At least one lowercase letter
//   if (!/[a-z]/.test(password)) {
//     errors.push("Password must contain at least one lowercase letter.");
//   }

  // At least one number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  // At least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default validatePassword;
