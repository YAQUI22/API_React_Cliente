import React, { useEffect, useState } from "react";
import { getEmpleadosConSucursal } from "./services/empleadoService";
import EmpleadoModal from "./components/EmpleadoModal";
import EmpleadoTable from "./components/EmpleadoTable";
import { Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

function App() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [empleadoToEdit, setEmpleadoToEdit] = useState(null);

  const fetchEmpleados = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmpleadosConSucursal();
      setEmpleados(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response) {
        setError(`Error servidor: ${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        setError("No se recibió respuesta del servidor. ¿El backend está corriendo?");
      } else {
        setError(err.message || "Error desconocido");
      }
      console.error("Detalle error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleCreateClick = () => {
    setEmpleadoToEdit(null);
    setModalShow(true);
  };

  const handleEditClick = (empleado) => {
    setEmpleadoToEdit(empleado);
    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
    setEmpleadoToEdit(null);
  };

  const handleSuccess = () => {
    fetchEmpleados();
  };

  return (
    <Container fluid className="app-container">
      <div className="app-header">
        <h1 className="app-title">
          <i className="bi bi-people-fill me-3"></i>
          Sistema de Gestión de Empleados
        </h1>
        <p className="app-subtitle">Administra tu equipo de trabajo de manera eficiente</p>
      </div>

      <div className="content-wrapper">
        <div className="table-header">
          <div>
            <h2 className="section-title">Listado de Empleados</h2>
            <p className="section-subtitle">
              {!loading && !error && `Total: ${empleados.length} empleado${empleados.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateClick}
            className="btn-create"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Crear Nuevo Empleado
          </Button>
        </div>

        <EmpleadoTable
          empleados={empleados}
          loading={loading}
          error={error}
          onEdit={handleEditClick}
          onRefresh={fetchEmpleados}
        />
      </div>

      <EmpleadoModal
        show={modalShow}
        handleClose={handleModalClose}
        empleado={empleadoToEdit}
        onSuccess={handleSuccess}
      />
    </Container>
  );
}

export default App;