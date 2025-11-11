// src/components/EmpleadoForm.js
import React, { useState } from "react";
import { createEmpleado } from "../services/empleadoService";
import 'bootstrap/dist/css/bootstrap.min.css';

function EmpleadoForm({ onEmpleadoCreado }) {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [salario_base, setSalario_base] = useState("");
  const [idsucursal, setIdsucursal] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(null);

    if (!nombres.trim() || !apellidos.trim() || !telefono.trim() || !direccion.trim() || !salario_base.trim() || !idsucursal.trim() ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const nuevoEmpleado = { nombres, apellidos, telefono, direccion,salario_base, idsucursal };
      const respuesta = await createEmpleado(nuevoEmpleado);
      setMensaje("Empleado agregado correctamente.");
      setNombres("");
      setApellidos("");
      setTelefono("");
      setDireccion("");
      setSalario_base("");
      setIdsucursal("");

      if (onEmpleadoCreado) onEmpleadoCreado(); // actualiza la lista en App.js
      console.log("Respuesta del servidor:", respuesta);
    } catch (err) {
      console.error("Error al crear el empleado:", err)
      setError("No se pudo crear el empleado. Verifica la conexión con el servidor.");
    }
  };

  return (
    <div>
      <h2>Agregar nuevo empleado</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombres: </label>
          <input
            type="text"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />
        </div>

        <div>
          <label>Apellidos: </label>
          <input
            type="text"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />
        </div>

        <div>
          <label>Teléfono: </label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div>
          <label>Dirección: </label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <div>
          <label>Salario Base: </label>
          <input
            type="number"
            value={salario_base}
            onChange={(e) => setSalario_base(e.target.value)}
          />
        </div>

        <div class="mb-3">
          <label  class="form-label">ID Sucursal: </label>
          <input
            type="number" class="form-control"
            value={idsucursal}
            onChange={(e) => setIdsucursal(e.target.value)}
          />
        </div>

        <button type="submit">Guardar</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default EmpleadoForm;