import React, { useState } from 'react';
import { Badge } from '@/src/components/ui/badge';
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
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { gql, useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/src/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/src/components/ui/select';

// Definir la mutación para actualizar el rol de usuario
const UPDATE_USER_ROLE_CLIENT = gql`
  mutation updateUserRole($userId: String!, $role: Enum_RoleName!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      name
      email
      role
    }
  }
`;

// Definir la consulta para obtener usuarios
const GET_USERS_CLIENT = gql`
  query Query {
    users {
      role
      name
      image
      id
      email
      deleted
      eneabled
      createdAt
    }
  }
`;

export default function Component() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const {loading: loadingUsers} = useQuery(GET_USERS_CLIENT, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      setUsers(data.users);
    },
  });

  const [updateUserRole] = useMutation(UPDATE_USER_ROLE_CLIENT, {
    onCompleted: () => {
      setLoading(false);
      setAlert({ type: 'success', message: 'Rol actualizado correctamente' });
      setTimeout(() => setAlert(null), 3000);
      setSelectedUser(null);
    },
    onError: () => {
      setLoading(false);
      setAlert({ type: 'error', message: 'Hubo un error al actualizar el rol' });
      setTimeout(() => setAlert(null), 3000);
    },
  });

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
  };

  const handleUpdateRole = () => {
    if (!selectedUser || !selectedRole) return;
    setLoading(true);
    updateUserRole({
      variables: {
        userId: selectedUser.id,
        role: selectedRole.toUpperCase(),
      },
    });
  };

  if (loadingUsers) return <p>Cargando usuarios...</p>;

  return (
    <Card>
      <CardHeader className="px-7 flex-row flex items-center justify-between">
        <div>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            Usuarios registrados en la aplicación del restaurante.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Creación</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.image} />
                  </Avatar>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.createdAt
                    ? format(new Date(user.createdAt), 'dd/MM/yyyy')
                    : 'No disponible'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEditUser(user)}>Editar Usuario</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {selectedUser && (
        <Dialog open={true} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogTitle>Editar Usuario: {selectedUser.name}</DialogTitle>
            <DialogDescription>Actualiza el rol del usuario.</DialogDescription>
            <div className="mb-4">
              <label className="block mb-2 text-sm">
                Correo: {selectedUser.email}
              </label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="USER">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateRole} disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {alert && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded text-white ${
            alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {alert.message}
        </div>
      )}
    </Card>
  );
}
