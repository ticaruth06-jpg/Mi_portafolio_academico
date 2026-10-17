/* =====================================================================
   MODELO FÍSICO DE LA BASE DE DATOS  ·  CompuTech - Sistema de Productos
   Motor : Microsoft SQL Server (2016 o superior)
   Autor : Nayeli Quispe Tica · UPLA · Desarrollo de Aplicaciones I
   Uso   : Ejecutar completo en SQL Server Management Studio (SSMS).
   ===================================================================== */

USE master;
GO

IF DB_ID('CompuTechDB') IS NOT NULL
BEGIN
    ALTER DATABASE CompuTechDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CompuTechDB;
END
GO

CREATE DATABASE CompuTechDB COLLATE Latin1_General_100_CI_AI;
GO

USE CompuTechDB;
GO

/* ---------------------------------------------------------------------
   1. TABLA CATEGORIA
   --------------------------------------------------------------------- */
CREATE TABLE dbo.Categoria (
    id_categoria  INT IDENTITY(1,1) NOT NULL,
    nombre        VARCHAR(40)       NOT NULL,
    CONSTRAINT PK_Categoria        PRIMARY KEY (id_categoria),
    CONSTRAINT UQ_Categoria_nombre UNIQUE (nombre)
);
GO

/* ---------------------------------------------------------------------
   2. TABLA USUARIO  (la clave se guarda cifrada: PBKDF2 + sal, "sal:hash")
   --------------------------------------------------------------------- */
CREATE TABLE dbo.Usuario (
    login       VARCHAR(20)   NOT NULL,
    clave_hash  VARCHAR(120)  NOT NULL,
    nombre      VARCHAR(80)   NOT NULL,
    correo      VARCHAR(80)   NOT NULL,
    rol         VARCHAR(10)   NOT NULL CONSTRAINT DF_Usuario_rol DEFAULT 'USUARIO',
    fecha_alta  DATETIME      NOT NULL CONSTRAINT DF_Usuario_fecha DEFAULT GETDATE(),
    CONSTRAINT PK_Usuario     PRIMARY KEY (login),
    CONSTRAINT CK_Usuario_rol CHECK (rol IN ('ADMIN','USUARIO'))
);
GO

/* ---------------------------------------------------------------------
   3. TABLA PRODUCTO
   --------------------------------------------------------------------- */
CREATE TABLE dbo.Producto (
    codigo        VARCHAR(10)    NOT NULL,
    nombre        VARCHAR(120)   NOT NULL,
    marca         VARCHAR(40)    NOT NULL CONSTRAINT DF_Producto_marca DEFAULT '',
    id_categoria  INT            NOT NULL,
    precio        DECIMAL(10,2)  NOT NULL,
    stock         INT            NOT NULL CONSTRAINT DF_Producto_stock DEFAULT 0,
    estado        VARCHAR(15)    NOT NULL CONSTRAINT DF_Producto_estado DEFAULT 'Disponible',
    descripcion   VARCHAR(300)   NOT NULL CONSTRAINT DF_Producto_desc DEFAULT '',
    imagen        VARCHAR(60)    NOT NULL CONSTRAINT DF_Producto_img DEFAULT 'mouse.svg',
    CONSTRAINT PK_Producto           PRIMARY KEY (codigo),
    CONSTRAINT FK_Producto_Categoria FOREIGN KEY (id_categoria)
        REFERENCES dbo.Categoria (id_categoria),
    CONSTRAINT CK_Producto_precio    CHECK (precio > 0),
    CONSTRAINT CK_Producto_stock     CHECK (stock >= 0),
    CONSTRAINT CK_Producto_estado    CHECK (estado IN ('Disponible','Agotado','Descontinuado'))
);
GO

CREATE INDEX IX_Producto_categoria ON dbo.Producto (id_categoria);
CREATE INDEX IX_Producto_nombre    ON dbo.Producto (nombre);
GO

/* ---------------------------------------------------------------------
   4. DATOS INICIALES
   --------------------------------------------------------------------- */
INSERT INTO dbo.Categoria (nombre) VALUES
 ('Laptops'),('Computadoras'),('Monitores'),('Periféricos'),
 ('Componentes'),('Almacenamiento'),('Redes'),('Audio');
GO

-- Administrador: usuario "admin" / clave "admin123" (guardada cifrada)
INSERT INTO dbo.Usuario (login, clave_hash, nombre, correo, rol) VALUES
 ('admin', '0ZiuT+XGYeNVlTgZ9nDqVQ==:nYEYSZmpqoEkH4azPbH6p5cuXL0QRMDdxJg4kn6TqBs=',
  'Administrador CompuTech', 'admin@computech.pe', 'ADMIN');
GO

INSERT INTO dbo.Producto (codigo, nombre, marca, id_categoria, precio, stock, estado, descripcion, imagen) VALUES
('P001', 'Laptop Lenovo IdeaPad 3 14"', 'Lenovo', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Laptops'), 2199.00, 10, 'Disponible', 'Ryzen 5, 8 GB RAM, SSD 512 GB y pantalla Full HD de 14".', 'laptop.svg'),
('P002', 'Mouse Logitech G502 Hero', 'Logitech', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Periféricos'), 189.00, 25, 'Disponible', 'Sensor óptico de 25 600 DPI, 11 botones programables.', 'mouse.svg'),
('P003', 'Teclado Redragon Kumara', 'Redragon', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Periféricos'), 150.00, 0, 'Agotado', 'Teclado mecánico TKL retroiluminado RGB, switches rojos.', 'teclado.svg'),
('P004', 'Monitor Teros Gamer 24"', 'Teros', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Monitores'), 649.00, 8, 'Disponible', 'Full HD, 75 Hz, panel IPS con bordes ultradelgados y base reforzada.', 'monitor.svg'),
('P005', 'Tarjeta de video MSI GeForce RTX Gaming X', 'MSI', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Componentes'), 2999.00, 5, 'Disponible', '8 GB GDDR6, doble ventilador Twin Frozr e iluminación RGB Mystic Light.', 'gpu.svg'),
('P006', 'SSD NVMe M.2 1 TB con disipador RGB', 'CompuTech', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Almacenamiento'), 259.00, 40, 'Disponible', 'PCIe 4.0, lectura hasta 5 000 MB/s y disipador de aluminio con iluminación RGB.', 'ssd.svg'),
('P007', 'PC Gamer Machine Blanca RGB', 'Gamer Machine', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Computadoras'), 5499.00, 4, 'Disponible', 'Core i7, RTX 4070, 32 GB DDR5, refrigeración líquida y gabinete de cristal blanco.', 'pc.svg'),
('P008', 'Auriculares Logitech G733 Lightspeed', 'Logitech', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Audio'), 329.00, 18, 'Disponible', 'Inalámbricos, iluminación RGB Lightsync y micrófono Blue Voice.', 'auriculares.svg'),
('P009', 'Memoria RAM Corsair Vengeance RGB 16 GB DDR5', 'Corsair', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Componentes'), 289.00, 30, 'Disponible', 'DDR5 5600 MHz con iluminación RGB Capellix y disipador de aluminio.', 'ram.svg'),
('P010', 'Router ASUS ROG Rapture GT-AX11000 Pro', 'ASUS', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Redes'), 1899.00, 0, 'Agotado', 'Wi-Fi 6 tri-banda para gaming con 8 antenas y puertos de 2.5 Gigabit.', 'router.svg'),
('P011', 'Webcam Logitech Brio 500 Full HD', 'Logitech', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Periféricos'), 329.00, 14, 'Disponible', 'Full HD 1080p, corrección automática de luz y micrófono con reducción de ruido.', 'webcam.svg'),
('P012', 'Laptop Lenovo IdeaPad 3 15"', 'Lenovo', (SELECT id_categoria FROM dbo.Categoria WHERE nombre='Laptops'), 2599.00, 12, 'Disponible', 'Core i5, 8 GB RAM, SSD 512 GB, pantalla Full HD de 15.6".', 'laptop.svg');
GO

/* ---------------------------------------------------------------------
   5. USUARIO DE CONEXIÓN PARA LA APLICACIÓN (autenticación SQL Server)
      Cambie la contraseña si lo desea y actualícela en db.properties.
      Requiere que el servidor permita "SQL Server and Windows Auth mode".
   --------------------------------------------------------------------- */
USE master;
GO
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'computech_app')
    CREATE LOGIN computech_app WITH PASSWORD = 'CompuTech#2026', CHECK_POLICY = OFF;
GO
USE CompuTechDB;
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'computech_app')
    CREATE USER computech_app FOR LOGIN computech_app;
GO
ALTER ROLE db_datareader ADD MEMBER computech_app;
ALTER ROLE db_datawriter ADD MEMBER computech_app;
GO

/* ---------------------------------------------------------------------
   6. VERIFICACIÓN
   --------------------------------------------------------------------- */
SELECT p.codigo, p.nombre, c.nombre AS categoria, p.precio, p.stock, p.estado
FROM dbo.Producto p INNER JOIN dbo.Categoria c ON c.id_categoria = p.id_categoria
ORDER BY p.codigo;
SELECT login, nombre, correo, rol FROM dbo.Usuario;
GO
