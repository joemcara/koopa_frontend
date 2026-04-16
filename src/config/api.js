// ============================================================
// CONFIGURACIÓN GLOBAL DEL API
// ============================================================
// Cambia aquí la URL base del backend para todos los módulos.
//
// En DESARROLLO (local):
//   → No necesitas hacer nada, usa el fallback "http://localhost:8081"
//
// En PRODUCCIÓN:
//   Opción 1: Crea un archivo .env.local con:
//             NEXT_PUBLIC_API_BASE_URL=http://200.9.176.39:8081
//
//   Opción 2: Cambia directamente el fallback aquí abajo.
// ============================================================

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
