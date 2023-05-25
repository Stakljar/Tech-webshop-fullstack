export const productTypes = ["Desktop Computer", "Laptop", "Monitor", "Headphones", "Mouse", "Keyboard", "Mousepad"]
export const productBrands = ["ASUS", "ACER", "Lenovo", "HP", "MSI", "Razer", "Other"]

export const roles = {
  guest: "guest",
  user: "user",
  employee: "employee"
}

export const authType = {
  login: "login",
  registration: "registration",
}

export function convertObjectToList(object) {
  let specs = []
  for (const [key, value] of Object.entries(object)) {
    specs.push({ key: key, value: value })
  }
  return specs;
}
