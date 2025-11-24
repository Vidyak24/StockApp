
// Simulating a secure database storage for user credentials
const MOCK_USER_DATABASE = [
  { username: 'admin', password: 'user123' }
];

/**
 * Validates user credentials against the mock database.
 * Simulates an asynchronous database call.
 */
export const validateCredentials = async (username: string, password: string): Promise<boolean> => {
  // Simulate network/database latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // specific check for the requested credentials
  const user = MOCK_USER_DATABASE.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  return !!user;
};
