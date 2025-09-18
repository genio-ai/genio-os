// Simple in-memory mock DB (resets on each deploy)
// For production, replace with a real database.
const _db = {
  users: new Map(), // key: email, value: user object
};

export function findUserByEmail(email) {
  return _db.users.get(email.toLowerCase()) || null;
}

export function insertUser(user) {
  const emailKey = user.email.toLowerCase();
  _db.users.set(emailKey, user);
  return user;
}
