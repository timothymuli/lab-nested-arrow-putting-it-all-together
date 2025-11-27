// --- 1. FUNCTION DEFINITION (The Closure) ---

/**
 * Creates a login handler function that securely tracks
 * and limits the number of consecutive failed login attempts.
 * * The inner function forms a closure over 'attemptCount' and 'userInfo',
 * maintaining the state across multiple calls.
 * * @param {object} userInfo - Object containing the valid user credentials. 
 * @param {string} userInfo.username - The user's valid username.
 * @param {string} userInfo.password - The user's valid password.
 * @returns {function(string): string} The inner function to handle a login attempt.
 */
function createLoginTracker(userInfo) {
  // Define maximum attempts as a constant.
  const MAX_ATTEMPTS = 3;

  // Initialize Login Tracking (The closure variable)
  let attemptCount = 0;

  // Define and return an Inner Arrow Function (The Closure)
  return (passwordAttempt) => {

    // Increment the attemptCount for every call
    attemptCount++;

    // Check for Lockout
    // This check must happen first to enforce the lock even after a failure
    if (attemptCount > MAX_ATTEMPTS) {
      return `Account Locked due to too many failed login attempts. (Attempts: ${attemptCount})`;
    }

    // Check for Successful Login
    if (passwordAttempt === userInfo.password) {
       // Reset attemptCount here for the next session if the user logs in successfully
       attemptCount = 0;
       return `Login Successful! Welcome, ${userInfo.username}. (Attempts: 1)`;
    }

    // Login Failed (If we haven't hit the lockout limit yet)
    const remainingAttempts = MAX_ATTEMPTS - attemptCount;

    if (remainingAttempts === 0) {
      return `Login Failed. This was your last attempt. Account is now locked.`;
    } else {
      return `Login Failed. Please try again. Remaining attempts: ${remainingAttempts}`;
    }
  };
}

// --- 2. TESTING AND VERIFICATION ---

const userCredentials = {
  username: "jujo",
  password: "malaikaJj"
};

// 1. Create the tracker (Initializes attemptCount = 0)
const handleLogin = createLoginTracker(userCredentials);

// 2. Test attempts
console.log(handleLogin("wrongPassword")); // Login Failed. Remaining attempts: 2
console.log(handleLogin("anotherWrong")); // Login Failed. Remaining attempts: 1
console.log(handleLogin("malaikaJj")); // Login Successful!

// If we tried again after success (or continued failing):
const handleLockout = createLoginTracker(userCredentials); // New tracker (Counter starts at 0)

console.log(handleLockout("wrong_pass_1")); // Login Failed. (Attempt 4)
console.log(handleLockout("wrong_pass_2")); // Account Locked. (Attempt 5)
console.log(handleLockout("any_pass")); // Lockout Enforced, correct password ignored.
console.log(handleLockout("malaikaJj")); 






    
    
  module.exports = {
  ...(typeof createLoginTracker !== 'undefined' && { createLoginTracker })
};