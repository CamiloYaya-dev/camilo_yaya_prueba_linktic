# Microservicios de Inventario y Productos

Este proyecto implementa dos microservicios independientes, `inventory-service` y `products-service`, que se comunican entre sí mediante peticiones HTTP siguiendo el estándar JSON API. El objetivo es proporcionar una solución escalable, documentada y testeada para la gestión de productos e inventario.

## Tecnologías Utilizadas

- Node.js + Express.js
- Sequelize (ORM)
- SQLite (base de datos en memoria y persistente)
- Docker y Docker Compose
- Swagger / OpenAPI para documentación
- Jest + Supertest para pruebas
- Azure Container Apps para despliegue en la nube

## Estructura del Proyecto

```
├── inventory-service
│   ├── src
│   ├── tests
│   ├── Dockerfile
│   └── Readme
├── products-service
│   ├── src
│   ├── tests
│   ├── Dockerfile
│   └── Readme
├── docker-compose.yml
├── .env.compose - toca crearlo
└── LINKTIC CAMILO YAYA.postman_collection.json
└── README.md (general)
```

## Ambientes Desplegados y Recursos de Prueba

Ambos microservicios se encuentran desplegados públicamente en Azure Container Apps, incluyendo sus respectivas documentaciones interactivas con Swagger:

- [Inventory Service - Swagger Docs](https://inventory-service.purplewater-62103a52.eastus.azurecontainerapps.io/docs/#/)

- [Products Service - Swagger Docs](https://products-service.purplewater-62103a52.eastus.azurecontainerapps.io/docs/#/)

### Colección de Postman
Se incluye una colección de Postman con todos los endpoints organizados tanto para entorno local como para entorno productivo (Azure), facilitando la validación, pruebas y exploración de la API.

## Instalación y Ejecución Local

⚠️ Nota de Seguridad: Aunque es una buena práctica no exponer ni compartir claves API, en este caso se han dejado visibles en el README únicamente con fines prácticos.
Esto permite mantener coherencia entre las claves usadas en el entorno local y las claves configuradas en el entorno desplegado (Azure), facilitando así las pruebas sin necesidad de modificaciones adicionales.

### Requisitos

- Node.js >= 18
- Docker y Docker Compose

### Usando Docker Compose

1. Crear un archivo `.env.compose` en la raíz con:

   ```env
    INVENTORY_PORT=3001
    INTERNAL_API_KEY_INVENTORY=3f2c1a79-89e3-42f3-9d18-f6c2c4bcb4ef
    PRODUCTS_SERVICE_API_KEY=6f8b8cf0-5e92-44af-8c7f-83f81f9d4e63
    PRODUCTS_SERVICE_BASE_URL=http://products-service:3000

    INTERNAL_API_KEY_PRODUCTS=6f8b8cf0-5e92-44af-8c7f-83f81f9d4e63
    PRODUCTS_PORT=3000
   ```

2. Levantar los servicios:

   ```bash
   docker compose --env-file .env.compose up --build
   ```

3. Acceder a la documentación Swagger en:

   - [http://localhost:3000/docs](http://localhost:3000/docs) (Products)
   - [http://localhost:3001/docs](http://localhost:3001/docs) (Inventory)

### Para ejecutar sin Docker (modo desarrollo)

1. Entrar a cada microservicio e instalar dependencias:

   ```bash
   cd inventory-service && npm install
   cd ../products-service && npm install
   ```

2. Crear archivos `.env` dentro de cada microservicio:

   - `products-service/.env`

     ```env
     PORT=3000
     INTERNAL_API_KEY=6f8b8cf0-5e92-44af-8c7f-83f81f9d4e63
     ```

   - `inventory-service/.env`

     ```env
     PORT=3001
     INTERNAL_API_KEY=3f2c1a79-89e3-42f3-9d18-f6c2c4bcb4ef
     PRODUCTS_SERVICE_API_KEY=6f8b8cf0-5e92-44af-8c7f-83f81f9d4e63
     PRODUCTS_SERVICE_BASE_URL=http://localhost:3000
     ```

3. Ejecutar cada servicio:

   ```bash
   npm start
   ```

## Pruebas

Ejecutar las pruebas unitarias e integración en cada servicio:

```bash
npm test
```

Cobertura lograda: **>90%** en ambos microservicios.

## Diagrama de Arquitectura

La solución está compuesta por dos microservicios desplegados en contenedores, ya sea **localmente con Docker Compose** o **en Azure Container Apps**, que se comunican entre sí de forma segura mediante autenticación por API keys.

```mermaid
graph TD
  subgraph Cliente
    user[Cliente Inventario<br>Usuario o Postman]
    admin[Cliente Productos<br>Admin o Postman]
  end

  subgraph Azure o Docker
    inv[Inventory Service]
    prod[Products Service]
  end

  user -->|x-api-key| inv
  inv -->|Validación de producto<br>PRODUCTS_SERVICE_API_KEY| prod
  admin -->|x-api-key| prod

  inv --> dbInv[(DB Inventory - SQLite)]
  prod --> dbProd[(DB Products - SQLite)]

  inv -->|/docs| docsInv[Swagger UI Inventory]
  prod -->|/docs| docsProd[Swagger UI Products]
```

### Flujo de interacción

1. Cliente de Inventario (por ejemplo, Postman o front-end de ventas) interactúa con Inventory Service, autenticado con x-api-key.
2. Inventory Service, al actualizar o consultar stock, valida con Products Service que el producto exista, usando PRODUCTS_SERVICE_API_KEY.
3. Cliente de Productos (por ejemplo, un administrador o sistema de gestión) puede interactuar directamente con Products Service para crear, actualizar o eliminar productos.
4. Ambos servicios cuentan con su base de datos SQLite local.
5. Cada servicio expone su documentación Swagger en /docs.
6. El despliegue puede realizarse tanto de forma local (mediante Docker Compose) como en la nube (Azure Container Apps).

## Decisiones Técnicas

- **SQLite**: elegida por simplicidad en entorno local y despliegue rápido.
- **JSON API**: garantiza estandarización de respuestas y errores.
- **Autenticación con API Keys**: protege las rutas internas entre servicios.
- **axios-retry**: maneja fallos temporales en la comunicación HTTP.
- **Swagger**: documentación explícita y legible para consumidores.
- **Container Apps**: simplifica despliegue individual y comunicación externa.

## Estado del Proyecto

✔️ Microservicios implementados y desplegados  
✔️ Comunicación HTTP autenticada entre servicios  
✔️ Pruebas unitarias e integración con alta cobertura  
✔️ Documentación Swagger completa  
✔️ Despliegue en Azure Container Apps  
✔️ Docker Compose funcional para entorno local

---

> Para más detalles revisa los README individuales de `inventory-service` y `products-service`.

