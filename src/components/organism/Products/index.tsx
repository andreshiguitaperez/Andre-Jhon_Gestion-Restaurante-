import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useSession } from 'next-auth/react';  // Importa la función useSession de next-auth

// Consulta para obtener todos los productos
const GET_PRODUCTS = gql`
  query {
    productss {
      id
      name
      description
      price
      image
      stock
      createdBy
    }
    users {
      id
      name
    }
  }
`;

// Mutación para crear un nuevo producto
const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductsCreateInput!) {
    createProducts(data: $data) {
      id
      name
      description
      price
      image
      stock
    }
  }
`;

const ProductsPage = () => {
  const { data: session } = useSession();  // Obtén la sesión del usuario autenticado

  // Verifica si la sesión está cargada o es null
  if (!session) {
    return <p>Cargando sesión...</p>;  // Opcionalmente muestra un mensaje mientras la sesión se carga
  }

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS);  // Consulta de productos
  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      refetch();  // Actualiza la lista de productos después de la creación exitosa
      setIsOpen(false);  // Cierra el modal
    },
  });

  const [isOpen, setIsOpen] = useState(false);  // Estado para el modal
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0.0);
  const [stock, setStock] = useState(0);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const handleCreateProduct = async () => {
    if (!session) {
      // Si no hay sesión, muestra un mensaje de error
      console.log('Usuario no autenticado');
      return;
    }

    setLoadingCreate(true);

    try {
      await createProduct({
        variables: {
          data: {
            name,
            description,
            price,
            image: '',  // Agregar un campo para la imagen si es necesario
            stock,
            createdBy: session.user.id,  // Asocia el producto al usuario autenticado
          },
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCreate(false);
    }
  };

  // Función handleCancel definida para cerrar el modal
  const handleCancel = () => {
    setIsOpen(false);  // Cierra el modal
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Productos</h1>
      
      {/* Botón de agregar producto */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Agregar Producto
      </button>

      {/* Tabla de productos */}
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Saldo</th>
            <th className="px-4 py-2">Responsable</th>
          </tr>
        </thead>
        <tbody>
          {data?.productss?.map((product: any) => {
            const user = data?.users?.find((user: any) => user.id === product.createdBy);
            return (
              <tr key={product.id}>
                <td className="border px-4 py-2">{product.id}</td>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">
                  {user ? user.name : 'No disponible'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal para agregar un producto */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
            <h2 className="text-xl mb-4">Agregar Producto</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  step="0.01"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Saldo Inicial</label>
                <input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancel}  // Usa handleCancel aquí
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateProduct}
                  disabled={loadingCreate}
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  {loadingCreate ? 'Creando...' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
