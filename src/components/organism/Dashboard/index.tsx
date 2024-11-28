import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/src/components/ui/card';
import { ChartContainer } from '@/src/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Definir los tipos para los productos y las órdenes
interface Product {
  id: string;
  name: string;
  stock: number;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  product: Product;
}

const GET_ORDERS = gql`
  query {
    orders {
      id
      total
      status
      createdAt
      product {
        id
        name
      }
    }
  }
`;

const GET_PRODUCTS = gql`
  query {
    productss {
      id
      name
      stock
    }
  }
`;

const Charts = () => {
  const { data: session } = useSession();
  const { data: productsData, loading: loadingProducts } = useQuery(GET_PRODUCTS);
  const { data: ordersData, loading: loadingOrders } = useQuery(GET_ORDERS);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Función para procesar las órdenes y obtener los datos para la gráfica
  const processOrdersForGraph = () => {
    if (!ordersData?.orders || !selectedProduct) return [];

    const productOrders = ordersData.orders.filter((order: Order) => order.product.id === selectedProduct.id);

    // Agrupar las órdenes por fecha
    const stockData = productOrders.reduce((acc: { [key: string]: number }, order: Order) => {
      const date = new Date(order.createdAt).toLocaleDateString(); // Utiliza solo la fecha
      if (!acc[date]) acc[date] = 0;
      acc[date] += order.total; // Aumentar o reducir el stock según el tipo de orden
      return acc;
    }, {});

    // Generar el array de datos para la gráfica
    const labels = Object.keys(stockData);
    const stockValues = labels.map(label => stockData[label]);

    // Generar el formato adecuado para Recharts
    return labels.map((label, index) => ({
      date: label,
      stock: stockValues[index],
    }));
  };

  const chartData = processOrdersForGraph();

  if (loadingProducts || loadingOrders) return <p>Loading...</p>;

  return (
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
      <div className="w-full sm:grid-cols-2 gap-6 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
        <Card className="lg:max-w-md" x-chunk="charts-01-chunk-0">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Stock del producto seleccionado</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {selectedProduct?.name || 'Seleccione un producto'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mostrar select para elegir producto */}
            <select 
              onChange={(e) => {
                const product = productsData?.productss.find((prod: Product) => prod.id === e.target.value);
                setSelectedProduct(product || null);
              }}
              className="mb-4 p-2 border rounded"
            >
              <option value="">Seleccionar Producto</option>
              {productsData?.productss.map((product: Product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>

            {/* Mostrar la gráfica solo cuando haya datos */}
            {selectedProduct && chartData.length > 0 && (
              <ChartContainer
                config={{
                  productName: { label: selectedProduct.name },
                  chartColor: { color: 'hsl(var(--chart-1))' },
                }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stock" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Charts;
