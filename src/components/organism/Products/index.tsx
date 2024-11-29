import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';

const GET_PRODUCTS = gql`
  query {
    productss {
      id
      name
      stock
      image
      createdBy
      user {
        name
      }
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductsCreateInput!) {
    createProducts(data: $data) {
      id
      name
      stock
      image
    }
  }
`;

const ProductsPage = () => {
  const { data: session } = useSession(); // Obtiene la sesión actual
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS);
  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      refetch();
      setIsOpen(false);
      setSuccessMessage("Producto creado exitosamente!");
    },
    onError: (err) => {
      setErrorMessage(`Error al crear el producto: ${err.message}`);
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState("");
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateProduct = async () => {
    if (!session) {
      setErrorMessage("Usuario no autenticado");
      return;
    }

    try {
      await createProduct({
        variables: {
          data: {
            name,
            description,
            price,
            stock,
            image,
            createdBy: session.user.id, // Utiliza el ID del usuario en la sesión
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Verificar si el usuario es admin basado en la sesión
  const isAdmin = session?.user?.role === 'ADMIN';
  console.log("El rol real es: ", session)
  console.log("Es adminitrador?", isAdmin);

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Productos</CardTitle>
        <CardDescription>Lista de productos registrados.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mostrar mensajes de éxito o error */}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

        {/* Mostrar el botón solo si el usuario es admin */}
        {isAdmin && (
          <Button onClick={() => setIsOpen(true)} className="mb-4">
            Agregar Producto
          </Button>
        )}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead>Imagen</TableHead>
              <TableHead>Responsable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.productss?.map((product: any) => {
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      "No disponible"
                    )}
                  </TableCell>
                  <TableCell>{product.user?.name || 'Desconocido'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
            <h2 className="text-xl mb-4">Agregar Producto</h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre del Producto
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Precio
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700"
                >
                  Saldo Inicial
                </label>
                <input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Imagen del Producto (URL)
                </label>
                <input
                  id="image"
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateProduct}
                  disabled={creating || stock <= 0}
                >
                  {creating ? "Creando..." : "Crear Producto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProductsPage;
