# KeepeR — Guía de Arquitectura del Backend (FastAPI)

Este documento explica **cómo vamos a organizar el proyecto en FastAPI** a partir de la base de datos ya definida (`script_base_datos.sql`), para que cualquier persona del equipo sepa qué va en cada carpeta, qué va en cada archivo, y cómo replicar el patrón para las tablas que le toquen.

La idea central es simple: **cada tabla de la base de datos tiene "su propia línea" que atraviesa todas las carpetas** (config no aplica por tabla, es única). Es decir, la tabla `usuario` tiene su `usuario_model.py`, su `usuario_controller.py` y su `usuario_router.py`. La tabla `reporte` tiene los suyos, y así con todas.

---

#### Respetar la estrctura

## 1. Estructura general del proyecto

```
KeepeR
├── app
│   ├── config
│   │   ├── __init__.py
│   │   └── db_config.py
│   ├── controllers
│   │   ├── __init__.py
│   │   ├── auth_controller.py
│   │   ├── rol_controller.py
│   │   ├── usuario_controller.py
│   │   ├── contacto_confianza_controller.py
│   │   ├── zona_favorita_controller.py
│   │   ├── categoria_controller.py
│   │   ├── estado_reporte_controller.py
│   │   ├── servicio_emergencia_controller.py
│   │   ├── reporte_controller.py
│   │   ├── evidencia_controller.py
│   │   ├── validacion_controller.py
│   │   ├── alerta_controller.py
│   │   ├── confirmacion_comunitaria_controller.py
│   │   ├── sos_controller.py
│   │   └── notificacion_controller.py
│   ├── models
│   │   ├── __init__.py
│   │   ├── rol_model.py
│   │   ├── usuario_model.py
│   │   ├── contacto_confianza_model.py
│   │   ├── zona_favorita_model.py
│   │   ├── categoria_model.py
│   │   ├── estado_reporte_model.py
│   │   ├── servicio_emergencia_model.py
│   │   ├── reporte_model.py
│   │   ├── evidencia_model.py
│   │   ├── validacion_model.py
│   │   ├── alerta_model.py
│   │   ├── confirmacion_comunitaria_model.py
│   │   ├── sos_model.py
│   │   └── notificacion_model.py
│   ├── router
│   │   ├── __init__.py
│   │   ├── auth_router.py
│   │   ├── rol_router.py
│   │   ├── usuario_router.py
│   │   ├── contacto_confianza_router.py
│   │   ├── zona_favorita_router.py
│   │   ├── categoria_router.py
│   │   ├── estado_reporte_router.py
│   │   ├── servicio_emergencia_router.py
│   │   ├── reporte_router.py
│   │   ├── evidencia_router.py
│   │   ├── validacion_router.py
│   │   ├── alerta_router.py
│   │   ├── confirmacion_comunitaria_router.py
│   │   ├── sos_router.py
│   │   └── notificacion_router.py
│   ├── schemas
│   │   ├── __init__.py
│   │   └── auth_schema.py
│   ├── utils
│   │   ├── __init__.py
│   │   ├── jwt_handler.py
│   │   └── password_handler.py
│   ├── __init__.py
│   └── main.py
├── entornovirtual/           (venv, no se sube al repo)
├── .env
├── .gitignore
└── requirements.txt
```

**Regla fija:** toda carpeta empieza con un `__init__.py` vacío. Eso permite hacer imports limpios tipo `from controllers.usuario_controller import UsuarioController` en vez de rutas relativas largas.

---

## 2. Qué va en cada carpeta

| Carpeta | Responsabilidad | Cuántos archivos |
|---|---|---|
| `config/` | Conexión a la base de datos (única, no depende de tablas) | 1 archivo (`db_config.py`) |
| `controllers/` | La lógica de negocio: queries SQL, validaciones, manejo de errores | 1 archivo por tabla |
| `models/` | Los `BaseModel` de Pydantic que definen qué datos recibe/valida cada endpoint | 1 archivo por tabla |
| `router/` | Los endpoints (`APIRouter`) que exponen cada tabla vía HTTP | 1 archivo por tabla |
| `schemas/` | Modelos que **no** representan una tabla 1 a 1 (ej: login, tokens) | Solo lo que no encaje en `models` |
| `utils/` | Funciones reutilizables que no son de una sola tabla: hashing, JWT, etc. | Según necesidad |

### 2.1 `config/db_config.py`

Contiene la función que abre la conexión a PostgreSQL. Es el único archivo de esta carpeta y lo usan **todos** los controllers.

```python
import psycopg2

def get_db_connection():
    return psycopg2.connect(
        host="xxx",
        port="xxx",
        user="xxx",
        password="xxxx",
        dbname="xxxx",
    )
```

> Los valores reales (host, user, password, etc.) van en el `.env`que les enviare a parte`. Nunca se sube el `.env` al repositorio.

### 2.2 `controllers/<tabla>_controller.py`

Aquí vive **toda la lógica**: abrir conexión, ejecutar el `SELECT`/`INSERT`/`UPDATE`, manejar errores de Postgres (`UniqueViolation`, etc.) y decidir qué `HTTPException` lanzar. El router **nunca** habla directo con la base de datos, siempre pasa por el controller.

Cada tabla tiene su clase controller con (mínimo) estos 5 métodos, que son el estándar para **todas** las tablas del sistema:

1. `create(...)` → `INSERT`
2. `get_all()` → `SELECT` de todos los registros activos (`status = TRUE`)
3. `get_by_id(id)` → `SELECT` de uno solo
4. `update(id, ...)` → `UPDATE`
5. `delete(id)` → **soft delete**, es decir `UPDATE ... SET status = FALSE`, nunca un `DELETE` real. Esto es clave porque casi todas las tablas del script tienen columna `status`.

El ejemplo completo (`UsuarioController`) ya lo tenemos como plantilla base — se copia esa misma estructura para las demás tablas, cambiando el nombre de la tabla, las columnas y las validaciones propias de cada una (ver sección 4).

### 2.3 `models/<tabla>_model.py`

Es el "molde" de Pydantic que valida lo que llega en el body de una petición `POST`/`PUT`. Un modelo por tabla, con los mismos campos que la tabla (menos los que genera la base de datos sola: `id`, `created_at`, `updated_at`, `status`).

```python
from pydantic import BaseModel, Field

class Usuario(BaseModel):
    nombres: str
    apellidos: str
    cedula: str
    correo: str
    telefono: str
    password_hash: str = Field(..., min_length=6, max_length=60)
```

### 2.4 `router/<tabla>_router.py`

Define los endpoints con `APIRouter`, usando siempre el mismo `prefix` (nombre de la tabla en plural o como se prefiera) y `tags` para que se agrupe bien en la documentación automática (`/docs`). Cada método del controller se conecta a un endpoint:

| Método HTTP | Ruta | Acción |
|---|---|---|
| `POST` | `/recurso/` | Crear |
| `GET` | `/recurso/` | Listar todos |
| `GET` | `/recurso/{id}` | Obtener uno |
| `PUT` | `/recurso/{id}` | Actualizar |
| `DELETE` | `/recurso/{id}` | Eliminar (soft delete) |

Ese es el estándar de **5 endpoints por tabla** que se repite en todo el proyecto.

### 2.5 `schemas/`

Se usa para modelos que no son "una tabla completa", sino combinaciones o respuestas especiales. Ahora mismo el único caso es autenticación:

```python
# schemas/auth_schema.py
from pydantic import BaseModel

class LoginSchema(BaseModel):
    usuario: str
    contrasena: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    rol: str
    usuario_id: int
```

En nuestra base de datos, esto se traduce a: `LoginSchema` recibe `correo` (o `cedula`) + `password_hash` en texto plano, y `TokenResponse` devuelve el JWT junto con `id_rol` e `id_usuario`, ya que el login no inserta ni actualiza una tabla como tal, solo autentica.

### 2.6 `utils/`

Funciones puras y reutilizables, sin lógica de una tabla específica:

- **`password_handler.py`**: `hash_password()` y `verify_password()`, usados por `usuario_controller.py` (campo `password_hash`) y por el login.
- **`jwt_handler.py`**: `create_access_token()` para generar el token al hacer login y `verify_token()` como dependencia (`Depends`) para proteger rutas que requieran sesión iniciada.

### 2.7 `main.py`

Punto de entrada. Crea la instancia de `FastAPI`, configura CORS y hace `include_router()` de **cada** router del proyecto. Cuando alguien agregue una tabla nueva, el último paso siempre es registrar su router aquí.

---

## 3. El patrón, resumido en un diagrama

```
Cliente (frontend / Postman /Insominia)
        │
        ▼
   router/<tabla>_router.py     ← define el endpoint y valida con el model
        │  usa
        ▼
   models/<tabla>_model.py      ← valida los datos de entrada (Pydantic)
        │
        ▼
   controllers/<tabla>_controller.py   ← ejecuta el SQL, valida reglas de negocio
        │  usa
        ▼
   config/db_config.py          ← abre/cierra la conexión a PostgreSQL
        │
        ▼
      PostgreSQL (Neon)
```

`utils/` y `schemas/` se usan de forma transversal cuando hace falta (autenticación, hashing, tokens).

---

## 4. Mapeo de la base de datos a los archivos del proyecto

Estas son las **14 tablas** del script (`script_base_datos.sql`) y cómo se traduce cada una a su trío `model` / `controller` / `router`. Todas siguen el patrón de los 5 endpoints y soft delete (`status`), salvo notas puntuales.

### 4.1 `rol`
- **Archivo:** `rol_model.py`, `rol_controller.py`, `rol_router.py`
- **Campos propios:** `nombre`, `descripcion`
- **Relaciones:** es referenciada por `usuario` (`id_rol`). Por eso tiene `ON DELETE RESTRICT`: no se puede borrar un rol si hay usuarios usándolo.
- **Nota:** tabla catálogo, probablemente casi no cambie, pero igual lleva sus 5 endpoints por consistencia.

### 4.2 `usuario`
- **Archivo:** `usuario_model.py`, `usuario_controller.py`, `usuario_router.py` (+ `auth_controller.py` / `auth_router.py` para login)
- **Campos propios:** `id_rol` (FK), `nombres`, `apellidos`, `fecha_nacimiento`, `cedula`, `correo`, `telefono`, `password_hash`, `foto_perfil`
- **Nota:** es la tabla base ya desarrollada en el ejemplo. El `password_hash` siempre pasa por `hash_password()` antes de guardarse, nunca se guarda en texto plano. El login vive aparte, en `auth_controller.py` + `auth_router.py` + `schemas/auth_schema.py`, para no mezclar CRUD con autenticación.

### 4.3 `contacto_confianza`
- **Archivo:** `contacto_confianza_model.py`, `contacto_confianza_controller.py`, `contacto_confianza_router.py`
- **Campos propios:** `id_usuario` (FK), `nombre`, `telefono`, `correo`, `parentesco`
- **Relaciones:** pertenece a un `usuario` (`ON DELETE CASCADE`, si se borra el usuario se borran sus contactos).
- **Nota:** el endpoint `get_all` normalmente se filtra por `id_usuario` (contactos del usuario logueado), no todos los de la plataforma.

### 4.4 `zona_favorita`
- **Archivo:** `zona_favorita_model.py`, `zona_favorita_controller.py`, `zona_favorita_router.py`
- **Campos propios:** `id_usuario` (FK), `nombre`, `tipo` (`casa`/`trabajo`/`universidad`/`otro`), `latitud`, `longitud`, `radio_metros`
- **Nota:** el campo `tipo` tiene una lista fija de valores (`CHECK` en SQL); conviene validarlo también en el `model` con un `Literal` o `Enum` de Pydantic para que el error salga antes de llegar a la base de datos.

### 4.5 `categoria`
- **Archivo:** `categoria_model.py`, `categoria_controller.py`, `categoria_router.py`
- **Campos propios:** `nombre`, `descripcion`, `icono`, `color`
- **Nota:** tabla catálogo, usada por `reporte`.

### 4.6 `estado_reporte`
- **Archivo:** `estado_reporte_model.py`, `estado_reporte_controller.py`, `estado_reporte_router.py`
- **Campos propios:** `nombre_estado`, `descripcion`
- **Nota:** tabla catálogo (ej: "pendiente", "validado", "rechazado"), usada por `reporte`.

### 4.7 `servicio_emergencia`
- **Archivo:** `servicio_emergencia_model.py`, `servicio_emergencia_controller.py`, `servicio_emergencia_router.py`
- **Campos propios:** `nombre`, `descripcion`, `telefono`, `instrucciones`
- **Nota:** tabla catálogo, usada por `sos`.

### 4.8 `reporte`
- **Archivo:** `reporte_model.py`, `reporte_controller.py`, `reporte_router.py`
- **Campos propios:** `id_usuario` (FK), `id_categoria` (FK), `id_estado` (FK), `titulo`, `descripcion`, `latitud`, `longitud`, `fecha_reporte`, `hora_reporte`
- **Nota:** es la tabla "central" del sistema — de ella cuelgan `evidencia`, `validacion`, `alerta` y `confirmacion_comunitaria`. Su controller es el más grande porque probablemente necesite consultas con `JOIN` (traer nombre de categoría y estado, no solo el id).

### 4.9 `evidencia`
- **Archivo:** `evidencia_model.py`, `evidencia_controller.py`, `evidencia_router.py`
- **Campos propios:** `id_reporte` (FK), `url_archivo`, `tipo_archivo` (`imagen`/`video`/`audio`/`otro`), `descripcion`
- **Nota:** normalmente se listan las evidencias de un reporte específico (`get_all` filtrado por `id_reporte`), similar al caso de "imágenes de mascota" que se veía en el ejemplo previo del equipo.

### 4.10 `validacion`
- **Archivo:** `validacion_model.py`, `validacion_controller.py`, `validacion_router.py`
- **Campos propios:** `id_reporte` (FK), `id_usuario` (FK, moderador), `decision` (`aceptado`/`rechazado`), `comentario`, `fecha_validacion`
- **Nota:** requiere el usuario autenticado (moderador) vía `verify_token`. Un mismo moderador no puede validar el mismo reporte dos veces (restricción única en la BD), así que el controller debe capturar ese error igual que el `UniqueViolation` del ejemplo de usuario.

### 4.11 `alerta`
- **Archivo:** `alerta_model.py`, `alerta_controller.py`, `alerta_router.py`
- **Campos propios:** `id_reporte` (FK), `titulo`, `mensaje`, `radio_impacto_metros`, `fecha_expiracion`
- **Nota:** se genera a partir de un reporte ya validado. El `get_all` probablemente deba excluir alertas ya expiradas (`fecha_expiracion < NOW()`).

### 4.12 `confirmacion_comunitaria`
- **Archivo:** `confirmacion_comunitaria_model.py`, `confirmacion_comunitaria_controller.py`, `confirmacion_comunitaria_router.py`
- **Campos propios:** `id_reporte` (FK), `id_usuario` (FK), `tipo` (`confirma`/`no_confirma`), `comentario`, `fecha_confirmacion`
- **Nota:** igual que `validacion`, un usuario solo puede confirmar un reporte una vez (restricción única), mismo manejo de error.

### 4.13 `sos`
- **Archivo:** `sos_model.py`, `sos_controller.py`, `sos_router.py`
- **Campos propios:** `id_usuario` (FK), `id_servicio` (FK), `latitud`, `longitud`, `fecha_sos`, `hora_sos`, `estado` (`realizado`/`cancelado`)
- **Nota:** al crear un SOS es probable que se dispare la creación de una `notificacion` asociada (ver siguiente tabla), así que el `create()` de este controller puede llamar internamente a `NotificacionController`.

### 4.14 `notificacion`
- **Archivo:** `notificacion_model.py`, `notificacion_controller.py`, `notificacion_router.py`
- **Campos propios:** `id_sos` (FK, opcional), `id_usuario` (FK), `titulo`, `mensaje`, `tipo` (`alerta`/`sistema`/`reporte`), `leida`, `fecha_leida`
- **Nota:** además de los 5 endpoints estándar, conviene un endpoint extra tipo `PUT /notificaciones/{id}/leida` para marcarla como leída (esto llenaría `fecha_leida` automáticamente, como exige el `CHECK` de la tabla).

---

## 5. Convenciones que hay que respetar en todas las tablas

1. **Soft delete siempre:** nunca usar `DELETE FROM`, siempre `UPDATE ... SET status = FALSE`. Todos los `SELECT` de listar/buscar deben filtrar `WHERE status = TRUE`.
2. **`updated_at` automático:** ya lo maneja el trigger `fn_actualizar_updated_at()` en la base de datos, así que en los `UPDATE` del controller no hace falta mandarlo manualmente, pero tampoco estorba si se envía `NOW()`.
3. **Manejo de errores igual en todos lados:** `try / except psycopg2.errors.UniqueViolation / except psycopg2.Error / finally: conn.close()`, tal como está en el ejemplo de `UsuarioController`.
4. **`RealDictCursor` siempre:** para que los resultados salgan como diccionarios y se puedan pasar directo por `jsonable_encoder`.
5. **Nombre de archivos:** `<tabla_singular>_model.py`, `<tabla_singular>_controller.py`, `<tabla_singular>_router.py`. Así cualquiera encuentra el archivo de una tabla sin tener que preguntar.
6. **Un router = un `prefix`:** el prefix del `APIRouter` debe coincidir con el nombre del recurso (ej: `/reportes`, `/alertas`, `/notificaciones`).
7. **Rutas protegidas:** cualquier endpoint que dependa de "quién está logueado" (crear reporte, hacer SOS, validar, confirmar) debe usar `Depends(verify_token)` de `utils/jwt_handler.py`.

---

## 6. Próximos pasos sugeridos

- [ ] Repartir las 14 tablas entre el equipo (cada quien toma su trío model/controller/router).
- [ ] Crear el config copiando la info del `.env` con las credenciales reales de la base de datos en Neon (nunca subirlo a Git).
- [ ] Registrar cada router nuevo en `main.py` a medida que se vaya completando.
- [ ] Acordar el formato de respuesta de error (mismo `HTTPException` con `detail` en español, como en el ejemplo).

---

