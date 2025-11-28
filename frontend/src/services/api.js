import axios from "axios";

const client = axios.create({
  baseURL: "/api"
});

export async function login(email, password) {
  const res = await client.post("/login", { email, password });
  return res.data;
}

export async function registerUser(user_name, email, password) {
  const res = await client.post("/register", { user_name, email, password });
  return res.data;
}

export async function getProducts() {
  const res = await client.get("/products");
  return res.data;
}

export async function optimizeProduct(productId) {
  const res = await client.post(`/products/${productId}/optimize`);
  return res.data;
}

export async function createProduct(payload) {
  const res = await client.post("/products", payload);
  return res.data;
}

export async function updateProduct(productId, payload) {
  const res = await client.put(`/products/${productId}`, payload);
  return res.data;
}

export async function deleteProduct(productId) {
  await client.delete(`/products/${productId}`);
}


