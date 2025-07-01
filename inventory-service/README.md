# Inventory Service

Este microservicio gestiona el inventario de productos. Permite consultar y actualizar el inventario de un producto específico, comunicándose con el `products-service` para validar la existencia del producto.

## Endpoints

| Método | Ruta                     | Descripción                          |
| ------ | ------------------------ | ------------------------------------ |
| GET    | `/inventory/{productId}` | Consulta inventario de un producto   |
| PATCH  | `/inventory/{productId}` | Actualiza inventario de un producto  |
| GET    | `/health`                | Revisión de salud y conexión a la DB |

Todos los endpoints (excepto `/health`) requieren el header:

```http
x-api-key: <INTERNAL_API_KEY>
```

## Tecnologías y Herramientas

- **Node.js + Express.js**
- **Sequelize + SQLite**
- **Docker**
- **Swagger / OpenAPI**
- **Jest + Supertest**

## Variables de Entorno

⚠️ Nota de Seguridad: Aunque es una buena práctica no exponer ni compartir claves API, en este caso se han dejado visibles en el README únicamente con fines prácticos.
Esto permite mantener coherencia entre las claves usadas en el entorno local y las claves configuradas en el entorno desplegado (Azure), facilitando así las pruebas sin necesidad de modificaciones adicionales.

```
PORT=3001
INTERNAL_API_KEY=3f2c1a79-89e3-42f3-9d18-f6c2c4bcb4ef
PRODUCTS_SERVICE_API_KEY=6f8b8cf0-5e92-44af-8c7f-83f81f9d4e63
PRODUCTS_SERVICE_BASE_URL=http://localhost:3000
```

> En despliegue en Azure, `PRODUCTS_SERVICE_BASE_URL` se apunta a la URL externa de `products-service`.

## Swagger Docs

Disponible localmente en:

```
http://localhost:3001/docs
```

Desplegado en Azure:

```
https://inventory-service.purplewater-62103a52.eastus.azurecontainerapps.io/docs/#/
```

## Pruebas

```bash
npm test
```

Se cubren:

- Casos de éxito y error de inventario
- Validaciones con comunicación al `products-service`
- Pruebas de integración y unitarias

> Cobertura superior al 90%

## Docker

```bash
docker build -t inventory-service .
docker run -p 3001:3001 inventory-service
```

## Health Check

Endpoint de salud:

```
GET /health
```

Responde si el servicio y la conexión a la base de datos están activos.

## Notas

- Se implementó un mecanismo básico de reintentos para llamadas HTTP al `products-service`.
- Para desarrollo local, ver archivo `.env` o usar `docker-compose` con `.env.compose`
