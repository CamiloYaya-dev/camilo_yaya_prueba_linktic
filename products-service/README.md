# Products Service

Este microservicio gestiona el catálogo de productos. Permite crear, listar, actualizar, obtener y eliminar productos. Es consumido por el `inventory-service` para validar productos existentes.

## Endpoints

| Método | Ruta             | Descripción                          |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/products`      | Crea un nuevo producto               |
| GET    | `/products`      | Lista todos los productos            |
| GET    | `/products/{id}` | Obtiene un producto por ID           |
| PUT    | `/products/{id}` | Actualiza un producto por ID         |
| DELETE | `/products/{id}` | Elimina un producto por ID           |
| GET    | `/health`        | Revisión de salud y conexión a la DB |

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

```env
PORT=3000
INTERNAL_API_KEY=6f8b8cf0-5e92-44af-8c7f-83f81f9d4e63
```

## Swagger Docs

Disponible localmente en:

```
http://localhost:3000/docs
```

Desplegado en Azure:

```
https://products-service.purplewater-62103a52.eastus.azurecontainerapps.io/docs/#/
```

## Pruebas

```bash
npm test
```

Se cubren:

- Casos de creación y actualización de productos
- Validaciones de errores (producto no encontrado, entradas inválidas)
- Pruebas unitarias e integración

> Cobertura superior al 90%

## Docker

```bash
docker build -t products-service .
docker run -p 3000:3000 products-service
```

## Health Check

Endpoint de salud:

```
GET /health
```

Verifica si el servicio y la base de datos están operativos.

## Notas

- Las respuestas siguen el estándar **JSON API**.
- Para desarrollo local, se recomienda usar `docker-compose` y definir las variables en `.env.compose`

