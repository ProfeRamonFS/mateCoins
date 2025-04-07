import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [modo, setModo] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cantidad, setCantidad] = useState({});
  const [historial, setHistorial] = useState([]);
  const [estudianteActivo, setEstudianteActivo] = useState(null);
  const [nombreIngresado, setNombreIngresado] = useState('');
  const [clave, setClave] = useState('');
  const [subastaActiva, setSubastaActiva] = useState(false);
  const [pujas, setPujas] = useState({});
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [ediciones, setEdiciones] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/estudiantes')
      .then(res => setEstudiantes(res.data));
  }, []);

  const abrirModalEdicion = (id, nombre) => {
    setIdEdicion(id);
    setNombreEditado(nombre);
    setMostrarModal(true);
  };

  const guardarNombreEditado = () => {
    if (!nombreEditado.trim()) return;

    axios.put(`http://localhost:3001/api/estudiantes/${idEdicion}`, { nombre: nombreEditado })
      .then(res => {
        setEstudiantes(estudiantes.map(e => e.id === idEdicion ? res.data : e));
        setEdiciones({ ...ediciones, [idEdicion]: nombreEditado });
        setMostrarModal(false);
      })
      .catch(() => alert("Error al editar estudiante"));
  };

  return (
    <div>
      {estudiantes.map(est => (
        <div key={est.id} className="mb-4 flex items-center justify-between">
          <div>
            <strong>{est.nombre}</strong> — 💰 {est.saldo}
            <input
              type="number"
              placeholder="Cantidad"
              value={cantidad[est.id] || ''}
              onChange={e => setCantidad({ ...cantidad, [est.id]: e.target.value })}
              className="ml-2 border p-1 rounded w-24"
            />
            <button
              className="ml-2 px-2 py-1 bg-green-200 hover:bg-green-300 rounded"
              onClick={() => agregarDinero(est.id)}>
              Agregar
            </button>
            <button
              className="ml-2 px-2 py-1 bg-purple-300 hover:bg-purple-400 rounded"
              onClick={() => abrirModalEdicion(est.id, est.nombre)}>
              Editar
            </button>
          </div>
          <button
            className="ml-4 px-2 py-1 bg-red-300 hover:bg-red-400 rounded"
            onClick={() => eliminarEstudiante(est.id)}>
            Eliminar
          </button>
        </div>
      ))}

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4">Editar nombre</h2>
            <input
              type="text"
              value={nombreEditado}
              onChange={(e) => setNombreEditado(e.target.value)}
              className="border w-full p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button className="px-4 py-2 bg-purple-400 text-white rounded" onClick={guardarNombreEditado}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;
