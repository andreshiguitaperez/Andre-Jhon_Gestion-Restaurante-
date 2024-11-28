import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Home,
  LineChart,
  Package,
  UtensilsCrossed,
  ShoppingCart,
  ClipboardList,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  // Estados para manejar submenús
  const [showMasters, setShowMasters] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  // Función para alternar submenús, asegurando que no se muestren juntos
  const toggleMasters = () => {
    setShowMasters(!showMasters);
    if (showTransactions) setShowTransactions(false); // Cierra el submenú de transacciones
  };

  const toggleTransactions = () => {
    setShowTransactions(!showTransactions);
    if (showMasters) setShowMasters(false); // Cierra el submenú de maestros
  };

  return (
    <div className='hidden border-r bg-muted/40 md:block'>
      <div className='flex h-full max-h-screen flex-col gap-2'>
        {/* Header */}
        <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
          <Link href='/' className='flex items-center gap-2 font-semibold'>
            <UtensilsCrossed className='h-6 w-6' color='#f97316' />
            <span style={{ color: '#f97316' }}>Gestión de restaurante</span>
          </Link>
          <Button variant='outline' size='icon' className='ml-auto h-8 w-8'>
            <Bell className='h-4 w-4' />
            <span className='sr-only'>Toggle notifications</span>
          </Button>
        </div>

        {/* Navigation */}
        <div className='flex-1'>
          <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
            <Link
              href='/'
              className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
            >
              <Home className='h-4 w-4' />
              Tableros
            </Link>

            {/* Transacciones */}
            <div className='relative'>
              <button
                onClick={toggleTransactions}
                className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
              >
                <div className='flex items-center gap-3'>
                  <ClipboardList className='h-4 w-4' />
                  <span>Transacciones</span>
                </div>

                {showTransactions ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              </button>

              {showTransactions && (
                <div className='ml-6 mt-1 space-y-1 border-l border-gray-300 pl-4'>
                  <Link
                    href='/orders'
                    className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted'
                  >
                    <ShoppingCart className='h-4 w-4' />
                    Órdenes
                  </Link>
                </div>
              )}
            </div>

            {/* Maestros */}
            <div className='relative'>
              <button
                onClick={toggleMasters}
                className='flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
              >
                <div className='flex items-center gap-3'>
                  <Package className='h-4 w-4' />
                  <span>Maestros</span>
                </div>

                {showMasters ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              </button>

              {showMasters && (
                <div className='ml-6 mt-1 space-y-1 border-l border-gray-300 pl-4'>
                  <Link
                    href='/products'
                    className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted'
                  >
                    <Package className='h-4 w-4' />
                    Productos
                  </Link>
                </div>
              )}
            </div>

            {/* Usuarios (Solo para administradores) */}
            {isAdmin && (
              <Link
                href='/users'
                className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
              >
                <LineChart className='h-4 w-4' />
                Usuarios
              </Link>
            )}
          </nav>
        </div>

        {/* Footer */}
        <div className='mt-auto p-4'>
          <Card x-chunk='dashboard-02-chunk-0' className='overflow-hidden'>
            <CardHeader className='flex flex-row gap-5 justify-between items-center p-4 md:flex-col md:justify-center md:items-center'>
              <Avatar className='w-12 h-12 rounded-full border-1 border-gray-200'>
                <AvatarImage
                  src={session?.user?.image ?? 'https://github.com/shadcn.png'}
                  className='object-cover rounded-full'
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className='text-center'>
                <CardTitle className='text-lg font-bold'>{session?.user?.name || 'Usuario'}</CardTitle>
                <CardTitle className='text-sm text-gray-500'>{session?.user?.email || 'Correo no disponible'}</CardTitle>
                <CardTitle className='text-sm text-orange-500'>{isAdmin ? 'Admin' : 'User'}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
