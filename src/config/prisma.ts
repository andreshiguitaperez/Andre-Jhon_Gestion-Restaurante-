import { PrismaClient } from '@prisma/client';

// Extiende el tipo global de NodeJS para permitir propiedades adicionales en globalThis
declare global {
  // Expande globalThis para permitir propiedades dinámicas
  var prismaGlobal: PrismaClient | undefined;
}

let prisma: PrismaClient;

// Verifica el entorno y usa el prismaGlobal si está disponible
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
  prisma = global.prismaGlobal;
}

export default prisma;
