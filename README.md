# Wallet Backend

## Descripción

Este proyecto es un sistema de backend para la gestión de una billetera electrónica. Está diseñado con Node.js y TypeScript y utiliza un enfoque híbrido de APIs REST y SOAP para manejar funcionalidades como registro de clientes, recarga de saldo, pagos, y confirmaciones de pago. La arquitectura está basada en una separación clara de responsabilidades mediante controladores, servicios, repositorios, y notificaciones. Además, incluye una robusta gestión de errores y pruebas unitarias y de integración.

## Características

- Registro de clientes con validación de documento y teléfono.
- Recarga de saldo en la billetera electrónica.
- Generación de token y sesión para realizar pagos de forma segura.
- Envío de correos electrónicos y SMS para notificaciones de eventos.
- Soporte para APIs REST y SOAP.
- Pruebas unitarias e integradas con mocks.
- Manejo de errores con códigos HTTP y `cod_error` personalizados.

## Estructura del Proyecto

```plaintext
src/
├── config/                # Configuración de base de datos y entorno
├── controllers/           # Controladores REST
├── middlewares/           # Validaciones y manejo de errores
│   ├── errors/            # Clases y manejo centralizado de errores
├── models/                # Modelos Sequelize
├── notifications/         # Servicios de notificación (email y SMS)
├── repositories/          # Lógica de acceso a datos (Sequelize)
├── routes/                # Definición de rutas REST
├── services/              # Lógica de negocio (SOAP)
├── soap/                  # Implementación y definiciones SOAP
│   ├── definitions/       # Definiciones WSDL
├── templates/             # Plantillas HTML para emails
├── tests/                 # Pruebas unitarias e integradas
│   ├── unit/              # Pruebas unitarias
│   ├── integration/       # Pruebas de integración
└── utils/                 # Utilidades generales
```

## Requisitos

- Node.js 16.x o superior
- Yarn 1.x o superior
- MySQL
- SendinBlue API Key para envío de correos y SMS

## Instalación y Configuración

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/jrdnbrj/wallet_backend.git
   cd wallet-backend
   ```

2. **Instalar dependencias:**

   ```bash
   yarn install
   ```

3. **Configurar el archivo `.env`:**

   Crea un archivo `.env` en la raíz del proyecto basado en el archivo `.env.example`:

   ```env
    PORT=your_port
    SOAP_PORT=your_soap_port
    EXTERNAL_DB_URL=your_external_db_url
    SENDINBLUE_API_KEY=tu_api_key
   ```

4. **Configurar la base de datos:**

   Si estás usando SQLite para pruebas locales:

   ```bash
   yarn migrate
   ```

   Si prefieres MySQL o PostgreSQL, actualiza la variable `DATABASE_URL` en tu archivo `.env` con los detalles de conexión correspondientes.

5. **Ejecutar el servidor:**

   ```bash
   yarn dev
   ```

   El servidor estará disponible en `http://localhost:8000`.

6. **Importar la colección de Postman (opcional):**

   En el proyecto encontrarás el archivo `Wallet.postman_collection.json`. Importa este archivo en Postman para acceder a los endpoints preconfigurados.

## Flujo de la Aplicación

```py
Postman (client) -> Controladores REST -> Servicios SOAP -> Repositorios -> Base de Datos
```

## Endpoints

#### 1. Ping

**Método:** GET  
**URL:** /api/ping  
**Descripción:** Endpoint de prueba para verificar que el servidor está activo.  
**Respuesta:**

```json
{
  "success": true,
  "message": "Pong"
}
```

### 2. Registrar Cliente

**Método:** POST  
**URL:** /api/clients/register  
**Descripción:** Registra un nuevo cliente.  
**Body de Ejemplo:**

```json
{
  "document": "1234567890",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890"
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "cod_error": "00",
  "data": {
    "id": "28",
    "document": "1234567890",
    "name": "John Doe",
    "email": "john.does@example.com",
    "phone": "+1234567890",
    "updatedAt": "2024-11-19T21:41:21.957Z",
    "createdAt": "2024-11-19T21:41:21.957Z"
  }
}
```

### 3. Recargar Wallet

**Método:** POST  
**URL:** /api/wallet/recharge  
**Descripción:** Recarga saldo en la billetera de un cliente.  
**Body de Ejemplo:**

```json
{
  "document": "1234567890",
  "phone": "+1234567890",
  "amount": 1000
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "cod_error": "00",
  "data": {
    "balance": "1000"
  }
}
```

### 4. Hacer Pago

**Método:** POST  
**URL:** /api/wallet/pay  
**Descripción:** Genera un pago y envía un token al cliente.  
**Body de Ejemplo:**

```json
{
  "document": "1234567890",
  "phone": "+1234567890",
  "amount": 120
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "cod_error": "00",
  "data": {
    "status": "PENDING",
    "id": "31",
    "clientId": "28",
    "amount": "120",
    "sessionId": "f15a7877-8a13-4a1b-9ae9-f739f9e82e73",
    "token": "656671",
    "updatedAt": "2024-11-19T21:42:21.365Z",
    "createdAt": "2024-11-19T21:42:21.365Z"
  }
}
```

### 5. Confirmar Pago

**Método:** POST  
**URL:** /api/wallet/:paymentId/confirm  
**Descripción:** Confirma un pago con sesión y token.  
**Headers:**

```
x-session-id: <session-id>
Authorization: Bearer <token>
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "cod_error": "00",
  "data": {
    "balance": "880",
    "paymentId": "31",
    "status": "COMPLETED"
  }
}
```

### 6. Consultar Saldo

**Método:** POST  
**URL:** /api/wallet/balance  
**Descripción:** Recarga saldo en la billetera de un cliente.  
**Body de Ejemplo:**

```json
{
  "document": "1234567890",
  "phone": "+1234567890"
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "cod_error": "00",
  "data": {
    "balance": "880"
  }
}
```

# Envío de Correos

Según los requisitos iniciales, se solicitó que se enviara un correo al momento de realizar un pago. Sin embargo, se decidió mejorar esta funcionalidad para ofrecer una mejor experiencia al usuario. Por lo tanto, se implementaron los siguientes envíos de correos electrónicos en distintos puntos clave del flujo:

1. **Registro del Cliente**:

   - Se envía un correo de bienvenida al usuario con sus datos básicos registrados (documento, nombre, correo y teléfono).

2. **Recarga de Saldo**:

   - Cuando el usuario recarga su wallet, se envía un correo con el monto de la recarga realizada y el nuevo balance disponible.

3. **Intento de Pago**:

   - Al iniciar un pago, se envía un correo con el ID de la transacción, el monto, el Session ID y el Token necesarios para completar la transacción.

4. **Confirmación del Pago**:
   - Tras confirmar un pago exitosamente, se envía un correo notificando que el monto fue descontado y mostrando el balance actualizado de la wallet.

### Beneficios de Esta Mejora

- **Transparencia**: El usuario está informado en todo momento del estado de su wallet y de sus transacciones.
- **Seguridad**: Los correos incluyen los detalles del Session ID y Token necesarios para realizar pagos, asegurando que solo el usuario legítimo pueda continuar el proceso.
- **Experiencia del Usuario**: Este enfoque mejora significativamente la interacción del usuario al proporcionar notificaciones detalladas y oportunas.

Esta mejora demuestra un enfoque centrado en el usuario y la atención al detalle, más allá de los requerimientos básicos establecidos en la prueba.

# Testing

Se implementaron pruebas utilizando Jest para garantizar la calidad y el correcto funcionamiento del sistema:

- **Unitarias**: Se probaron repositorios y servicios con mocks para aislar y verificar la lógica de negocio sin depender de la base de datos ni de servicios externos.
- **Integración**: Se verificaron los servicios SOAP en conjunto con la base de datos para asegurar que los diferentes componentes trabajan correctamente de forma conjunta.
- **End-to-End (E2E)**: Validación completa del flujo de la aplicación, desde los endpoints hasta la base de datos, asegurando la funcionalidad del sistema en un entorno realista.

### Ejecución de Pruebas

Para ejecutar las pruebas, utilizar el siguiente comando:

```bash
yarn jest
```

Este comando ejecutará todas las pruebas configuradas en el proyecto. Asegúrese de que las dependencias estén instaladas y las variables de entorno estén correctamente configuradas antes de ejecutar las pruebas.

# Notas sobre SOAP y Node.js

Aunque SOAP fue utilizado para cumplir con los requisitos del proyecto, a nivel profesional se recomienda evitar SOAP con Node.js por las siguientes razones:

- SOAP es más pesado y complejo comparado con REST.
- Node.js está optimizado para servicios ligeros y modernos.
- REST, combinado con GraphQL o WebSockets, suele ser más eficiente.

# Códigos de Error

El sistema utiliza códigos de error internos para proporcionar una capa adicional de información sobre los errores, además de los códigos HTTP estándar. Estos códigos internos (`cod_error`) están diseñados para identificar de manera precisa el tipo de error ocurrido y facilitar el manejo de errores en el cliente o sistema de integración.

- `01`: Unauthorized - El usuario no está autorizado para realizar esta operación.
- `04`: Not Found - El recurso solicitado no fue encontrado.
- `09`: Conflict - Se detectó un conflicto, como balance insuficiente o que el pago ya ha sido completado.
- `20`: Bad Request - La solicitud contiene datos inválidos o faltantes.
- `50`: Internal Server Error - Ocurrió un error inesperado en el servidor.
- `61`: Sequelize Validation Error - Error de validación en la base de datos.
- `62`: Sequelize Unique Constraint Violation - Violación de una restricción única en la base de datos.
- `63`: Sequelize Foreign Key Constraint Error - Error de clave foránea en la base de datos.
- `64`: Sequelize Database Error - Error genérico relacionado con la base de datos.

**Nota**: Los códigos HTTP estándar (como `400`, `401`, `404`, `500`, etc.) también se envían en la respuesta según la situación, alineándose con las mejores prácticas REST para que los clientes puedan manejarlos adecuadamente.
