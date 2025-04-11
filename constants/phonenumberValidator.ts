const validatePhoneNumber = (phoneNumber: string) => {
    const errors: string[] = [];
    
    // Regular expression to check if the phone number starts with +234 and is followed by 10 digits
    const regex = /^\+234\d{10}$/;

    // Check if the phone number starts with +234
    if (!phoneNumber.startsWith("+234")) {
        errors.push("Phone number must start with +234"); // Add error message to errors array
    }

    // Check if the phone number matches the regex pattern
    if (!regex.test(phoneNumber)) {
        errors.push("Phone number must contain exactly 10 digits after +234"); // Add error message to errors array
    }

    // Return the validation result
    return {
        isValid: errors.length === 0, // isValid is true if no errors, false otherwise
        errors, // Return the errors array
    };
};

export default validatePhoneNumber;

