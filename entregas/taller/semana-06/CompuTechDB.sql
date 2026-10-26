/* =====================================================================
   CompuTechDB - Base de datos completa de la aplicación (SQL Server)
   Proyecto: PaginaWeb-Proyecto (SistemaProductos)
   8 TABLAS: Categoria, Marca, Proveedor, Producto, Usuario,
             Carrito, Pedido, DetallePedido
   Es re-ejecutable: borra y vuelve a crear la base de datos.
   ===================================================================== */
USE master;
GO
IF DB_ID('CompuTechDB') IS NOT NULL
BEGIN
    ALTER DATABASE CompuTechDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CompuTechDB;
END
GO
CREATE DATABASE CompuTechDB;
GO
USE CompuTechDB;
GO

/* ============================ TABLAS ============================ */

-- 1) Categoria
CREATE TABLE dbo.Categoria (
    id_categoria INT IDENTITY(1,1) CONSTRAINT PK_Categoria PRIMARY KEY,
    nombre       NVARCHAR(50) NOT NULL CONSTRAINT UQ_Categoria_nombre UNIQUE
);
GO

-- 2) Marca
CREATE TABLE dbo.Marca (
    id_marca INT IDENTITY(1,1) CONSTRAINT PK_Marca PRIMARY KEY,
    nombre   NVARCHAR(60) NOT NULL CONSTRAINT UQ_Marca_nombre UNIQUE
);
GO

-- 3) Proveedor
CREATE TABLE dbo.Proveedor (
    id_proveedor INT IDENTITY(1,1) CONSTRAINT PK_Proveedor PRIMARY KEY,
    nombre       NVARCHAR(100) NOT NULL,
    ruc          VARCHAR(11)   NULL CONSTRAINT UQ_Proveedor_ruc UNIQUE,
    telefono     VARCHAR(20)   NULL,
    correo       NVARCHAR(120) NULL
);
GO

-- 4) Producto
CREATE TABLE dbo.Producto (
    codigo       VARCHAR(10)   NOT NULL CONSTRAINT PK_Producto PRIMARY KEY,
    nombre       NVARCHAR(120) NOT NULL,
    id_marca     INT           NULL CONSTRAINT FK_Producto_Marca
                                   FOREIGN KEY REFERENCES dbo.Marca(id_marca),
    id_categoria INT           NOT NULL CONSTRAINT FK_Producto_Categoria
                                   FOREIGN KEY REFERENCES dbo.Categoria(id_categoria),
    id_proveedor INT           NULL CONSTRAINT FK_Producto_Proveedor
                                   FOREIGN KEY REFERENCES dbo.Proveedor(id_proveedor),
    precio       DECIMAL(10,2) NOT NULL CONSTRAINT CK_Producto_precio CHECK (precio > 0),
    stock        INT           NOT NULL CONSTRAINT CK_Producto_stock  CHECK (stock >= 0),
    -- El estado se guarda tal como lo elige el administrador (Disponible | Agotado).
    -- Con stock 0 la aplicación lo fuerza a 'Agotado'.
    estado       VARCHAR(20)   NOT NULL CONSTRAINT DF_Producto_estado DEFAULT 'Disponible'
                                   CONSTRAINT CK_Producto_estado CHECK (estado IN ('Disponible','Agotado')),
    descripcion  NVARCHAR(500) NOT NULL CONSTRAINT DF_Producto_desc DEFAULT '',
    imagen       VARCHAR(100)  NOT NULL CONSTRAINT DF_Producto_imagen DEFAULT 'mouse.svg'
);
GO
CREATE INDEX IX_Producto_categoria ON dbo.Producto(id_categoria);
CREATE INDEX IX_Producto_marca     ON dbo.Producto(id_marca);
GO

-- 5) Usuario. Roles: ADMIN (todo), ALMACENERO (solo stock y estado), USUARIO (cliente)
CREATE TABLE dbo.Usuario (
    login      VARCHAR(20)   NOT NULL CONSTRAINT PK_Usuario PRIMARY KEY,
    clave_hash VARCHAR(200)  NOT NULL,              -- PBKDF2: sal(Base64):hash(Base64)
    nombre     NVARCHAR(100) NOT NULL,
    correo     NVARCHAR(120) NOT NULL,
    rol        VARCHAR(10)   NOT NULL CONSTRAINT CK_Usuario_rol CHECK (rol IN ('ADMIN','ALMACENERO','USUARIO'))
);
GO

-- 6) Carrito (un renglón por usuario y producto)
CREATE TABLE dbo.Carrito (
    login    VARCHAR(20) NOT NULL CONSTRAINT FK_Carrito_Usuario
                               FOREIGN KEY REFERENCES dbo.Usuario(login) ON DELETE CASCADE,
    codigo   VARCHAR(10) NOT NULL CONSTRAINT FK_Carrito_Producto
                               FOREIGN KEY REFERENCES dbo.Producto(codigo) ON DELETE CASCADE,
    cantidad INT         NOT NULL CONSTRAINT CK_Carrito_cantidad CHECK (cantidad > 0),
    fecha    DATETIME2   NOT NULL CONSTRAINT DF_Carrito_fecha DEFAULT SYSDATETIME(),
    CONSTRAINT PK_Carrito PRIMARY KEY (login, codigo)
);
GO

-- 7) Pedido (cabecera de la compra)
CREATE TABLE dbo.Pedido (
    id_pedido INT IDENTITY(1,1) CONSTRAINT PK_Pedido PRIMARY KEY,
    login     VARCHAR(20)   NOT NULL CONSTRAINT FK_Pedido_Usuario
                                  FOREIGN KEY REFERENCES dbo.Usuario(login),
    fecha     DATETIME2     NOT NULL CONSTRAINT DF_Pedido_fecha DEFAULT SYSDATETIME(),
    total     DECIMAL(12,2) NOT NULL CONSTRAINT CK_Pedido_total CHECK (total >= 0),
    estado    VARCHAR(20)   NOT NULL CONSTRAINT DF_Pedido_estado DEFAULT 'Pendiente'
                                  CONSTRAINT CK_Pedido_estado CHECK (estado IN ('Pendiente','Pagado','Enviado','Cancelado'))
);
GO

-- 8) DetallePedido (productos de cada pedido; guarda el precio del momento)
CREATE TABLE dbo.DetallePedido (
    id_detalle      INT IDENTITY(1,1) CONSTRAINT PK_DetallePedido PRIMARY KEY,
    id_pedido       INT           NOT NULL CONSTRAINT FK_Detalle_Pedido
                                        FOREIGN KEY REFERENCES dbo.Pedido(id_pedido) ON DELETE CASCADE,
    codigo          VARCHAR(10)   NOT NULL CONSTRAINT FK_Detalle_Producto
                                        FOREIGN KEY REFERENCES dbo.Producto(codigo),
    cantidad        INT           NOT NULL CONSTRAINT CK_Detalle_cantidad CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CONSTRAINT CK_Detalle_precio CHECK (precio_unitario > 0),
    CONSTRAINT UQ_Detalle UNIQUE (id_pedido, codigo)
);
GO

/* ============================ DATOS ============================= */
INSERT INTO dbo.Categoria (nombre) VALUES
 (N'Laptops'),(N'Computadoras'),(N'Monitores'),(N'Periféricos'),
 (N'Componentes'),(N'Almacenamiento'),(N'Redes'),(N'Audio');
GO

INSERT INTO dbo.Marca (nombre) VALUES
 (N'ASUS'),
 (N'Corsair'),
 (N'Gamer Machine'),
 (N'Kingston'),
 (N'Lenovo'),
 (N'Logitech'),
 (N'MSI'),
 (N'Redragon'),
 (N'Teros');
GO

INSERT INTO dbo.Proveedor (nombre, ruc, telefono, correo) VALUES
 (N'Tecno Import S.A.C.',           '20512345671', '01-4561234',  N'ventas@tecnoimport.pe'),
 (N'Distribuidora Periféricos Perú','20523456782', '01-4472211',  N'contacto@dperifericos.pe'),
 (N'Gamer Mayorista E.I.R.L.',      '20534567893', '064-231100',  N'pedidos@gamermayorista.pe'),
 (N'Componentes del Centro S.R.L.', '20545678904', '064-245566',  N'info@componentescentro.pe');
GO

INSERT INTO dbo.Producto (codigo, nombre, id_marca, id_categoria, precio, stock, estado, descripcion, imagen, id_proveedor)
SELECT v.codigo, v.nombre, m.id_marca, c.id_categoria, v.precio, v.stock, v.estado, v.descripcion, v.imagen, v.id_proveedor
FROM (VALUES
 ('P001', N'Laptop Lenovo IdeaPad 3 14"', N'Lenovo', N'Laptops', 1999.00, 12, 'Disponible', N'Intel Core i5, 8 GB RAM, SSD 512 GB, pantalla Full HD de 14".', 'laptop.svg', 1),
 ('P002', N'Mouse Gamer Logitech G502 Hero', N'Logitech', N'Periféricos', 219.00, 25, 'Disponible', N'Sensor óptico de 25 600 DPI, 11 botones programables, peso ajustable.', 'mouse.svg', 2),
 ('P003', N'Teclado Mecánico RGB TKL', N'Redragon', N'Periféricos', 189.00, 18, 'Disponible', N'Teclado mecánico compacto (TKL) con retroiluminación RGB.', 'teclado.svg', 3),
 ('P004', N'Monitor Gamer 24" 144 Hz', N'Teros', N'Monitores', 529.00, 9, 'Disponible', N'Panel Full HD de 24", 144 Hz, 1 ms, HDMI y DisplayPort.', 'monitor.svg', 3),
 ('P005', N'Tarjeta de Video MSI GeForce RTX Gaming X', N'MSI', N'Componentes', 2899.00, 4, 'Disponible', N'Tarjeta gráfica de alto rendimiento con doble ventilador e iluminación RGB.', 'gpu.svg', 4),
 ('P006', N'SSD NVMe M.2 1 TB con disipador', N'Kingston', N'Almacenamiento', 389.00, 30, 'Disponible', N'Unidad de estado sólido PCIe NVMe, lecturas de hasta 7 000 MB/s.', 'ssd.svg', 4),
 ('P007', N'PC Gamer Machine Blanca', N'Gamer Machine', N'Computadoras', 4299.00, 3, 'Disponible', N'Case de vidrio templado con refrigeración líquida y ventiladores RGB.', 'pc.svg', 3),
 ('P008', N'Auriculares Inalámbricos Logitech G733', N'Logitech', N'Audio', 459.00, 14, 'Disponible', N'Auriculares gamer inalámbricos con micrófono y luces LIGHTSYNC RGB.', 'auriculares.svg', 2),
 ('P009', N'Memoria RAM Corsair Vengeance RGB 16 GB DDR5', N'Corsair', N'Componentes', 349.00, 20, 'Disponible', N'Módulo DDR5 de 16 GB con iluminación RGB y disipador.', 'ram.svg', 4),
 ('P010', N'Router Gamer ASUS ROG Rapture WiFi 6E', N'ASUS', N'Redes', 1799.00, 6, 'Disponible', N'Router tribanda WiFi 6E con 8 antenas y puertos de 2.5 Gbps.', 'router.svg', 1),
 ('P011', N'Webcam Logitech Brio 100 Full HD', N'Logitech', N'Periféricos', 199.00, 16, 'Disponible', N'Cámara web Full HD 1080p con micrófono integrado y obturador de privacidad.', 'webcam.svg', 2),
 ('P012', N'Laptop Lenovo IdeaPad 3 15" Ryzen 5', N'Lenovo', N'Laptops', 2199.00, 0, 'Agotado', N'AMD Ryzen 5, 16 GB RAM, SSD 512 GB, pantalla de 15.6".', 'laptop.svg', 1)
) AS v(codigo, nombre, marca, categoria, precio, stock, estado, descripcion, imagen, id_proveedor)
INNER JOIN dbo.Categoria c ON c.nombre = v.categoria
INNER JOIN dbo.Marca     m ON m.nombre = v.marca;
GO

-- Usuarios iniciales (cambia las contraseñas luego):
--   admin    / admin123     (ADMIN)
--   almacen  / almacen123   (ALMACENERO)
INSERT INTO dbo.Usuario (login, clave_hash, nombre, correo, rol) VALUES
 ('admin', '8lwYFWIhM4o9eb7MMPH3xA==:gUTeX/4TmNyCafonlRy7QUNPcibdcyo/tmd24Rc9nOU=', N'Administrador', N'admin@computech.pe', 'ADMIN'),
 ('almacen', 'oS2RezEkrFnCMHdQgV/Ohg==:KQU0JUVW7CU18orPW+4YIzcqlRM44rrWaC6lw/KhBp8=', N'Almacenero', N'almacen@computech.pe', 'ALMACENERO');
GO

/* ============================ VISTAS ============================ */

-- Producto con sus nombres de marca, categoría y proveedor (lo que muestra el catálogo)
CREATE VIEW dbo.vw_ProductoDetalle AS
SELECT p.codigo, p.nombre,
       COALESCE(m.nombre, N'')  AS marca,
       c.nombre                 AS categoria,
       COALESCE(pr.nombre, N'') AS proveedor,
       p.precio, p.stock, p.estado, p.descripcion, p.imagen,
       p.precio * p.stock       AS valor_inventario
FROM dbo.Producto p
INNER JOIN dbo.Categoria c  ON c.id_categoria  = p.id_categoria
LEFT  JOIN dbo.Marca m      ON m.id_marca      = p.id_marca
LEFT  JOIN dbo.Proveedor pr ON pr.id_proveedor = p.id_proveedor;
GO

-- Reporte "Productos disponibles": estado Disponible y stock mayor que cero
CREATE VIEW dbo.vw_ProductosDisponibles AS
SELECT codigo, nombre, marca, categoria, precio, stock, estado
FROM dbo.vw_ProductoDetalle
WHERE stock > 0 AND estado = 'Disponible';
GO

-- Reporte "Resumen de productos": una sola fila con los totales del inventario
CREATE VIEW dbo.vw_ResumenInventario AS
SELECT COUNT(*) AS total_productos,
       SUM(CASE WHEN stock > 0 AND estado = 'Disponible' THEN 1 ELSE 0 END) AS disponibles,
       SUM(CASE WHEN stock > 0 AND estado = 'Disponible' THEN 0 ELSE 1 END) AS agotados,
       SUM(stock)           AS stock_total,
       SUM(precio * stock)  AS valor_inventario
FROM dbo.Producto;
GO

-- Pedidos con su cliente y sus productos (para cuando la aplicación registre compras)
CREATE VIEW dbo.vw_PedidoDetalle AS
SELECT pe.id_pedido, pe.fecha, pe.estado, u.login, u.nombre AS cliente,
       d.codigo, p.nombre AS producto, d.cantidad, d.precio_unitario,
       d.cantidad * d.precio_unitario AS subtotal
FROM dbo.Pedido pe
INNER JOIN dbo.Usuario u        ON u.login     = pe.login
INNER JOIN dbo.DetallePedido d  ON d.id_pedido = pe.id_pedido
INNER JOIN dbo.Producto p       ON p.codigo    = d.codigo;
GO

/* ===================== PROCEDIMIENTOS ALMACENADOS ===================== */
/* Equivalen a las operaciones de ProductoDAO y UsuarioDAO (CRUD).        */

-- C (Create): registrar producto. Crea la marca si no existe y fuerza Agotado con stock 0.
CREATE PROCEDURE dbo.sp_Producto_Insertar
    @codigo       VARCHAR(10),
    @nombre       NVARCHAR(120),
    @marca        NVARCHAR(60)  = N'',
    @categoria    NVARCHAR(50),
    @precio       DECIMAL(10,2),
    @stock        INT,
    @estado       VARCHAR(20)   = 'Disponible',
    @descripcion  NVARCHAR(500) = N'',
    @imagen       VARCHAR(100)  = 'mouse.svg',
    @id_proveedor INT           = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @id_categoria INT, @id_marca INT = NULL;
    SET @codigo = UPPER(LTRIM(RTRIM(@codigo)));
    SET @marca  = LTRIM(RTRIM(COALESCE(@marca, N'')));

    SELECT @id_categoria = id_categoria FROM dbo.Categoria WHERE nombre = @categoria;
    IF @id_categoria IS NULL THROW 50001, 'La categoría no existe.', 1;

    IF @marca <> N''
    BEGIN
        SELECT @id_marca = id_marca FROM dbo.Marca WHERE nombre = @marca;
        IF @id_marca IS NULL
        BEGIN
            INSERT INTO dbo.Marca (nombre) VALUES (@marca);
            SET @id_marca = SCOPE_IDENTITY();
        END
    END

    IF @stock = 0 SET @estado = 'Agotado';

    INSERT INTO dbo.Producto (codigo, nombre, id_marca, id_categoria, id_proveedor, precio, stock, estado, descripcion, imagen)
    VALUES (@codigo, LTRIM(RTRIM(@nombre)), @id_marca, @id_categoria, @id_proveedor, @precio, @stock, @estado, @descripcion, @imagen);
END
GO

-- R (Read): listar todos los productos
CREATE PROCEDURE dbo.sp_Producto_Listar
AS
BEGIN
    SET NOCOUNT ON;
    SELECT codigo, nombre, marca, categoria, precio, stock, estado, descripcion, imagen
    FROM dbo.vw_ProductoDetalle ORDER BY codigo;
END
GO

-- R (Read): buscar por código, nombre, categoría o todos (igual que ProductoDAO.buscar)
CREATE PROCEDURE dbo.sp_Producto_Buscar
    @criterio VARCHAR(10) = 'todos',      -- codigo | nombre | categoria | todos
    @texto    NVARCHAR(100) = N''
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @like NVARCHAR(102) = N'%' + LTRIM(RTRIM(@texto)) + N'%';
    SELECT codigo, nombre, marca, categoria, precio, stock, estado
    FROM dbo.vw_ProductoDetalle
    WHERE (@criterio = 'codigo'    AND codigo    LIKE @like)
       OR (@criterio = 'nombre'    AND nombre    LIKE @like)
       OR (@criterio = 'categoria' AND categoria LIKE @like)
       OR (@criterio NOT IN ('codigo','nombre','categoria')
           AND (codigo LIKE @like OR nombre LIKE @like OR categoria LIKE @like))
    ORDER BY codigo;
END
GO

-- U (Update): modificar los datos de un producto
CREATE PROCEDURE dbo.sp_Producto_Actualizar
    @codigo       VARCHAR(10),
    @nombre       NVARCHAR(120),
    @marca        NVARCHAR(60)  = N'',
    @categoria    NVARCHAR(50),
    @precio       DECIMAL(10,2),
    @stock        INT,
    @estado       VARCHAR(20)   = 'Disponible',
    @descripcion  NVARCHAR(500) = N'',
    @imagen       VARCHAR(100)  = 'mouse.svg'
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @id_categoria INT, @id_marca INT = NULL;
    SET @codigo = UPPER(LTRIM(RTRIM(@codigo)));
    SET @marca  = LTRIM(RTRIM(COALESCE(@marca, N'')));

    SELECT @id_categoria = id_categoria FROM dbo.Categoria WHERE nombre = @categoria;
    IF @id_categoria IS NULL THROW 50001, 'La categoría no existe.', 1;

    IF @marca <> N''
    BEGIN
        SELECT @id_marca = id_marca FROM dbo.Marca WHERE nombre = @marca;
        IF @id_marca IS NULL
        BEGIN
            INSERT INTO dbo.Marca (nombre) VALUES (@marca);
            SET @id_marca = SCOPE_IDENTITY();
        END
    END

    IF @stock = 0 SET @estado = 'Agotado';

    UPDATE dbo.Producto
    SET nombre = LTRIM(RTRIM(@nombre)), id_marca = @id_marca, id_categoria = @id_categoria,
        precio = @precio, stock = @stock, estado = @estado, descripcion = @descripcion, imagen = @imagen
    WHERE codigo = @codigo;

    IF @@ROWCOUNT = 0 THROW 50002, 'El producto no existe.', 1;
END
GO

-- U (Update): solo stock y estado (lo que puede hacer el ALMACENERO)
CREATE PROCEDURE dbo.sp_Producto_ActualizarStock
    @codigo VARCHAR(10),
    @stock  INT,
    @estado VARCHAR(20) = 'Disponible'
AS
BEGIN
    SET NOCOUNT ON;
    IF @stock = 0 SET @estado = 'Agotado';
    UPDATE dbo.Producto SET stock = @stock, estado = @estado
    WHERE codigo = UPPER(LTRIM(RTRIM(@codigo)));
    IF @@ROWCOUNT = 0 THROW 50002, 'El producto no existe.', 1;
END
GO

-- D (Delete): eliminar un producto (falla si ya fue vendido: FK de DetallePedido)
CREATE PROCEDURE dbo.sp_Producto_Eliminar
    @codigo VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.Producto WHERE codigo = UPPER(LTRIM(RTRIM(@codigo)));
    IF @@ROWCOUNT = 0 THROW 50002, 'El producto no existe.', 1;
END
GO

-- Usuario: registrar una cuenta (SIEMPRE con rol USUARIO, igual que la página de registro)
CREATE PROCEDURE dbo.sp_Usuario_Registrar
    @login      VARCHAR(20),
    @clave_hash VARCHAR(200),
    @nombre     NVARCHAR(100),
    @correo     NVARCHAR(120)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.Usuario (login, clave_hash, nombre, correo, rol)
    VALUES (LTRIM(RTRIM(@login)), @clave_hash, LTRIM(RTRIM(@nombre)), LTRIM(RTRIM(@correo)), 'USUARIO');
END
GO

-- Usuario: buscar una cuenta por su login (lo usa el inicio de sesión)
CREATE PROCEDURE dbo.sp_Usuario_Buscar
    @login VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT login, clave_hash, nombre, correo, rol FROM dbo.Usuario WHERE login = LTRIM(RTRIM(@login));
END
GO

/* =========================== VERIFICAR ========================== */
SELECT TABLE_NAME AS tabla FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' ORDER BY TABLE_NAME;  -- debe mostrar 8
SELECT p.codigo, p.nombre, m.nombre AS marca, c.nombre AS categoria, p.precio, p.stock, p.estado
FROM dbo.Producto p
INNER JOIN dbo.Categoria c ON c.id_categoria = p.id_categoria
LEFT  JOIN dbo.Marca m     ON m.id_marca = p.id_marca
ORDER BY p.codigo;
SELECT * FROM dbo.vw_ResumenInventario;
SELECT name AS vista FROM sys.views ORDER BY name;
SELECT name AS procedimiento FROM sys.procedures ORDER BY name;
GO

--VISUALIZAR--
SELECT login, nombre, correo, rol FROM dbo.Usuario;   -- cuentas registradas
GO
SELECT * FROM dbo.vw_ProductoDetalle;                 -- productos
GO
SELECT * FROM dbo.Carrito;                            -- carritos
GO
SELECT * FROM dbo.vw_PedidoDetalle ORDER BY id_pedido DESC;  -- compras
GO