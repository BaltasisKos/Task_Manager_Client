let users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Developer", title: "Frontend", active: true },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Designer", title: "UX", active: true },
];

export const getUsers = () => users;

export const addUser = (user) => {
  const newUser = { ...user, id: Date.now() };
  users.push(newUser);
  return newUser;
};

export const updateUser = (id, updatedUser) => {
  users = users.map((user) => (user.id === id ? { ...user, ...updatedUser } : user));
};

export const deleteUser = (id) => {
  users = users.filter((user) => user.id !== id);
};
