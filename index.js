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

    // Lockout Check Priority
    // The very first check must be if the account is already locked
    // based on previous failures (attemptCount >= MAX_ATTEMPTS).
    if (attemptCount >= MAX_ATTEMPTS) {
      return `Account locked due to too many failed login attempts`;
    }

    // Check for Successful Login
    if (passwordAttempt === userInfo.password) {
       // Reset attemptCount here for the next session if the user logs in successfully
       attemptCount = 0; // Reset the counter
       return `Login successful`;
    }

    // Login Failed (If we haven't hit the lockout limit yet)
    // Increment the count ONLY on a failed attempt.
    attemptCount++;

    // Check if this failure caused a new lockout.
  
      return `Attempt ${attemptCount}: Login failed`;
    

    
   
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
console.log(handleLogin("wrongPassword")); // Attempt 1: Login Failed
console.log(handleLogin("anotherWrong")); // Attempt 2: Login Failed
console.log(handleLogin("malaikaJj")); // Login Successful!

// If we tried again after success (or continued failing):
const handleLockout = createLoginTracker(userCredentials); // New tracker (Counter starts at 0)

// Attempt 1 (Count: 1, Remaining: 2)
console.log("Test 2a:", handleLockout("wrong_pass_1"));
// Attempt 2 (Count: 2, Remaining: 1)
console.log("Test 2b:", handleLockout("wrong_pass_2"));
// Attempt 3 (Count: 3, Remaining: 0 -> Lockout Warning)
console.log("Test 2c:", handleLockout("wrong_pass_3"));
// Attempt 4 (Count: 4 -> Lockout Enforced)
console.log("Test 2d:", handleLockout("any_password")); 
// Attempt 5 (Count: 5 -> Lockout Enforced, correct password ignored)
console.log("Test 2e:", handleLockout("malaikaJj"));

//This test proves that the closure creates a unique, private 'attemptCount' for each instance.
const trackerA = createLoginTracker({ username: 'UserA', password: 'passA' });
const trackerB = createLoginTracker({ username: 'UserB', password: 'passB' });

// Tracker A fails twice (A's attemptCount = 2)
console.log("A Status (Fail 1):", trackerA('bad_a_1'));
console.log("A Status (Fail 2):", trackerB('bad_a_2'));

// Tracker B succeeds (B's attemptCount = 1 -> Reset to 0)
// This should not affect Tracker A's state.
console.log("B Status (Success):", trackerB('passB'));

// Tracker A fails its third time and locks itself out (A's attemptCount = 3 -> Locked)
console.log("A Status (Lockout):", trackerA('bad_a_3'));

// Tracker B should still be working perfectly, confirming independence.
console.log("B Status (Still Working):", trackerB('passB'));

// --- 3. EXPORT (Required for the module system) ---

  module.exports = {
  ...(typeof createLoginTracker !== 'undefined' && { createLoginTracker })
};