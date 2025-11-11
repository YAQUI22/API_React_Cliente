import axios from "axios";


// Usamos la URL completa del backend
const API_BASE = "http://localhost:8800";


const api = axios.create({
 baseURL: API_BASE,
 timeout: 7000,
 headers: {
   "Content-Type": "application/json"
 }
});


//Obtiene todos los empleados y retorna array de empleados
export const getEmpleados = async () => {
 const response = await api.get("/apiv2/empleado");
 return response.data;
};

// Obtiene empleados con información de sucursal (endpoint requerido)
export const getEmpleadosConSucursal = async () => {
 const response = await api.get("/apiv2/empleado/empleadosucursal");
 return response.data;
};

// Obtiene un empleado por ID
export const getEmpleadoById = async (id) => {
 const response = await api.get(`/apiv2/empleado/${id}`);
 return response.data;
};

// Crea un nuevo empleado
export const createEmpleado = async (empleado) => {
 const response = await api.post("/apiv2/empleado", empleado);
 return response.data;
};

// Actualiza un empleado existente
export const updateEmpleado = async (id, empleado) => {
 const response = await api.put(`/apiv2/empleado/${id}`, empleado);
 return response.data;
};

// Elimina un empleado
export const deleteEmpleado = async (id) => {
 const response = await api.delete(`/apiv2/empleado/${id}`);
 return response.data;
};

// Obtiene todas las sucursales
export const getSucursales = async () => {
 const response = await api.get("/apiv2/sucursal");
 return response.data;
};
