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
import { Input } from '@/src/components/ui/input';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/src/components/ui/select';

// Consultas y Mutaciones GraphQL
const GET_PRODUCTS = gql`
  query {
    productss {
      id
      name
      stock
      image
      createdBy
    }
  }
`;

const GET_ORDERS = gql`
  query {
    orders {
      id
      total
      status
      createdAt
      createdBy
      product {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($data: OrderCreateInput!) {
    createOrder(data: $data) {
      id
      total
      status
      createdAt
      createdBy
      productChange
    }
  }
`;

const UPDATE_PRODUCT_STOCK = gql`
  mutation UpdateProducts($id: String!, $newStock: IntInput!) {
    updateProducts(
      where: { id: $id },
      data: { stock: $newStock }
    ) {
      id
      stock
    }
  }
`;

interface Product {
  id: string;
  name: string;
  stock: number;
  image: string;
  createdBy: string;
}

const OrderPage = () => {
  const { data: session } = useSession();
  const { data: productsData, loading: loadingProducts, error: errorProducts, refetch } = useQuery(GET_PRODUCTS);
  const { data: ordersData, loading: loadingOrders, error: errorOrders } = useQuery(GET_ORDERS);
  const [createOrder, { loading: creating }] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      refetch();
      setIsOpen(false);
      setSuccessMessage("Orden creada exitosamente.");
    },
    onError: () => {
      setErrorMessage("Hubo un error al crear la orden.");
    },
  });
  const [updateProducts] = useMutation(UPDATE_PRODUCT_STOCK);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderType, setOrderType] = useState("entrada");
  const [quantity, setQuantity] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateOrder = async () => {
    if (!session || !selectedProduct) {
      console.log("Usuario no autenticado o producto no seleccionado");
      return;
    }

    try {
      const newStock = orderType === "Entrada"
        ? selectedProduct.stock + quantity
        : selectedProduct.stock - quantity;

      await createOrder({
        variables: {
          data: {
            total: quantity,
            status: orderType,
            createdBy: session.user.id,
            productChange: selectedProduct.id,
          },
        },
      });

      await updateProducts({
        variables: {
          id: selectedProduct.id,
          newStock: { set: newStock },
        },
      });

      refetch();
      setIsOpen(false);
      setSuccessMessage("Orden creada exitosamente.");
    } catch (err) {
      console.error(err);
      setErrorMessage("Hubo un error al crear la orden.");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  if (loadingProducts || loadingOrders) return <p>Loading...</p>;
  if (errorProducts || errorOrders) return <p>Error: {errorProducts?.message || errorOrders?.message}</p>;

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Órdenes</CardTitle>
        <CardDescription>Lista de órdenes registradas.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsOpen(true)} className="mb-4">
          Agregar Orden
        </Button>

        {/* Mostrar mensaje de éxito o error */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md mb-4">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md mb-4">
            {errorMessage}
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID de Orden</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo de orden</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Producto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData?.orders?.map((order: any) => {
              const user = order.user;
              return (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>{user ? user.name : "No disponible"}</TableCell>
                  <TableCell>{order.product ? order.product.name : "Producto no disponible"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>

      {/* Diálogo para agregar una nueva orden */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
            <h2 className="text-xl mb-4">Agregar Orden</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                  Producto
                </label>
                <Select
                  value={selectedProduct?.id || ''}
                  onValueChange={(value) =>
                    setSelectedProduct(
                      productsData.productss.find((product: Product) => product.id === value) || null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un Producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productsData.productss.map((product: Product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <label htmlFor="order-type" className="block text-sm font-medium text-gray-700">
                  Tipo de Orden
                </label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Salida">Salida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Cantidad
                </label>
                <Input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  min={1}
                />
              </div>

              <div className="flex justify-end">
                <Button variant="secondary" onClick={handleCancel} className="mr-4">
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateOrder}
                  disabled={creating || !selectedProduct || quantity <= 0}
                >
                  Crear Orden
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OrderPage;
