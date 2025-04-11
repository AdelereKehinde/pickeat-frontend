interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  // Check if the email matches the pattern of a valid email address
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default validateEmail;