// src/lib/prisma.ts

// Importa la clase PrismaClient del paquete @prisma/client.
// Esta clase es la que usaremos para interactuar con la base de datos.
//import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "../generated/prisma";

// Define una variable global para el cliente de Prisma.
// Esto es crucial para evitar crear múltiples instancias en el entorno de desarrollo
// de Next.js, que tiene "Hot Module Replacement" (HMR). HMR recarga los módulos
// del servidor sin reiniciar, lo que podría crear nuevas instancias de Prisma
// con cada recarga y agotar las conexiones a la base de datos.
// 'global as unknown as' se utiliza para hacer un "casting" seguro en TypeScript,
// añadiendo una propiedad 'prisma' al objeto global.
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Exporta la instancia de Prisma.
// El operador de coalescencia nula '??' comprueba si 'globalForPrisma.prisma'
// ya existe. Si existe (porque ya se creó en una recarga previa), la reutiliza.
// Si no existe (es la primera vez que se carga el módulo), crea una nueva instancia.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Configura el registro (logging) de Prisma.
    // En el entorno de desarrollo, muestra los logs de 'query', 'error' y 'warn'
    // para facilitar la depuración.
    // En producción, solo muestra los 'error' para reducir el ruido y la carga.
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// En el entorno de desarrollo, guarda la instancia de Prisma recién creada
// en el objeto global.
// Esto asegura que la próxima vez que el código se recargue (por HMR),
// la instancia existente sea reutilizada en lugar de crear una nueva.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
