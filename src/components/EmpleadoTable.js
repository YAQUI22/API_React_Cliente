import React, { useState } from "react";
import { Table, Button, Badge, Modal } from "react-bootstrap";
import { deleteEmpleado } from "../services/empleadoService";
import "./EmpleadoTable.css";

function EmpleadoTable({ empleados, loading, error, onEdit, onRefresh }) {
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (empleado) => {
    setEmpleadoToDelete(empleado);
    setDeleteModalShow(true);
  };

  const handleDeleteConfirm = async () => {
    if (!empleadoToDelete) return;

    setDeleting(true);
    try {
      await deleteEmpleado(empleadoToDelete.idempleado);
      setDeleteModalShow(false);
      setEmpleadoToDelete(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
      alert("No se pudo eliminar el empleado. Por favor intente de nuevo.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando empleados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h5 className="alert-heading">Error al cargar empleados</h5>
        <p>{error}</p>
      </div>
    );
  }

  if (!empleados || empleados.length === 0) {
    return (
      <div className="text-center py-5 empty-state">
        <div className="empty-icon">
          <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
        </div>
        <h4 className="mt-3 text-muted">No hay empleados registrados</h4>
        <p className="text-muted">Comienza creando tu primer empleado</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <Table hover className="empleado-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Teléfonos</th>
              <th>Dirección</th>
              <th>Salario Base</th>
              <th>ID Sucursal</th>
              <th>Sucursal</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.idempleado}>
                <td>
                  <Badge bg="secondary">{empleado.idempleado}</Badge>
                </td>
                <td className="fw-semibold">
                  <i className="bi bi-person-fill me-2 text-primary"></i>
                  {empleado.empleado_nombre}
                </td>
                <td>{empleado.empleado_apellidos || empleado.apellidos || 'N/A'}</td>
                <td>
                  <i className="bi bi-telephone me-1"></i>
                  {empleado.empleado_telefonos || empleado.empleado_telefono || empleado.telefono || 'N/A'}
                </td>
                <td>{empleado.empleado_direccion || empleado.direccion || 'N/A'}</td>
                <td>
                  <Badge bg="success" className="px-3 py-2">
                    <i className="bi bi-currency-dollar me-1"></i>
                    {(empleado.empleado_salario_base || empleado.salario_base)
                      ? parseFloat(empleado.empleado_salario_base || empleado.salario_base).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                      : 'N/A'}
                  </Badge>
                </td>
                <td>
                  <Badge bg="warning" text="dark">{empleado.idsucursal}</Badge>
                </td>
                <td>
                  <Badge bg="info" className="px-3 py-2">
                    <i className="bi bi-building me-1"></i>
                    {empleado.sucursal_nombre}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onEdit(empleado)}
                      className="btn-action"
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Editar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(empleado)}
                      className="btn-action"
                    >
                      <i className="bi bi-trash me-1"></i>
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal
        show={deleteModalShow}
        onHide={() => !deleting && setDeleteModalShow(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {empleadoToDelete && (
            <>
              <p>¿Está seguro que desea eliminar al empleado?</p>
              <div className="alert alert-warning">
                <strong>
                  {empleadoToDelete.empleado_nombre}
                </strong>
                <br />
                <small>ID: {empleadoToDelete.idempleado}</small>
              </div>
              <p className="text-danger mb-0">
                <small>Esta acción no se puede deshacer.</small>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteModalShow(false)}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EmpleadoTable;
