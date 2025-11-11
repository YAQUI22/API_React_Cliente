import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { createEmpleado, updateEmpleado, getEmpleadoById } from "../services/empleadoService";
import "./EmpleadoModal.css";

function EmpleadoModal({ show, handleClose, empleado, onSuccess }) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    salario_base: "",
    idsucursal: ""
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Cargar datos del empleado si estamos editando
  useEffect(() => {
    const fetchEmpleadoCompleto = async () => {
      if (empleado && empleado.idempleado) {
        setLoadingData(true);
        setError(null);
        try {
          // Obtener datos completos del empleado desde el backend
          const response = await getEmpleadoById(empleado.idempleado);
          // El backend retorna un array, tomamos el primer elemento
          const empleadoCompleto = Array.isArray(response) ? response[0] : response;

          if (empleadoCompleto) {
            setFormData({
              nombres: String(empleadoCompleto.nombres || ""),
              apellidos: String(empleadoCompleto.apellidos || ""),
              telefono: String(empleadoCompleto.telefono || ""),
              direccion: String(empleadoCompleto.direccion || ""),
              salario_base: String(empleadoCompleto.salario_base || ""),
              idsucursal: String(empleadoCompleto.idsucursal || "")
            });
          } else {
            setError("No se encontraron datos del empleado.");
          }
        } catch (err) {
          console.error("Error al cargar empleado:", err);
          setError("No se pudieron cargar los datos del empleado.");
        } finally {
          setLoadingData(false);
        }
      } else {
        // Reset form para crear nuevo
        setFormData({
          nombres: "",
          apellidos: "",
          telefono: "",
          direccion: "",
          salario_base: "",
          idsucursal: ""
        });
      }
      setMensaje("");
    };

    if (show) {
      fetchEmpleadoCompleto();
    }
  }, [empleado, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(null);

    // Validación
    if (!String(formData.nombres).trim() || !String(formData.apellidos).trim() ||
        !String(formData.telefono).trim() || !String(formData.direccion).trim() ||
        !String(formData.salario_base).trim() || !String(formData.idsucursal).trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      if (empleado) {
        // Actualizar empleado existente
        await updateEmpleado(empleado.idempleado, formData);
        setMensaje("Empleado actualizado correctamente.");
      } else {
        // Crear nuevo empleado
        await createEmpleado(formData);
        setMensaje("Empleado creado correctamente.");
      }

      // Esperar un momento para mostrar el mensaje
      setTimeout(() => {
        if (onSuccess) onSuccess();
        handleClose();
      }, 1000);
    } catch (err) {
      console.error("Error al guardar el empleado:", err);
      setError("No se pudo guardar el empleado. Verifica la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" className="empleado-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title>
          {empleado ? "Editar Empleado" : "Crear Nuevo Empleado"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {mensaje && <Alert variant="success">{mensaje}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {loadingData ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Cargando datos del empleado...</p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Nombres <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  placeholder="Ingrese nombres"
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Apellidos <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="Ingrese apellidos"
                />
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Teléfono <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ingrese teléfono"
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Dirección <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ingrese dirección"
                />
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Salario Base <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  name="salario_base"
                  value={formData.salario_base}
                  onChange={handleChange}
                  placeholder="Ingrese salario base"
                  step="0.01"
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>ID Sucursal <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  name="idsucursal"
                  value={formData.idsucursal}
                  onChange={handleChange}
                  placeholder="Ingrese ID de sucursal"
                />
              </Form.Group>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Guardando..." : empleado ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default EmpleadoModal;
