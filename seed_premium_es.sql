-- Limpieza previa asegurada
DELETE FROM inventory;
DELETE FROM products;
DELETE FROM subcategories;
DELETE FROM categories;
DELETE FROM brands;

-- Insertar marcas (Brands)
INSERT INTO brands (id, name, description) VALUES
(gen_random_uuid(), 'Lukess Signature', 'Línea insignia de lujo y elegancia clásica.'),
(gen_random_uuid(), 'Artisan Heritage', 'Confección artesanal y materiales orgánicos premium.'),
(gen_random_uuid(), 'Minimalist Sartorial', 'Cortes modernos, minimalistas y funcionales para la ciudad.'),
(gen_random_uuid(), 'Pima Classics', 'Básicos esenciales fabricados con 100% Algodón Pima Peruano.');

-- Insertar Categorías
INSERT INTO categories (id, name, slug) VALUES
(gen_random_uuid(), 'Camisas', 'camisas'),
(gen_random_uuid(), 'Pantalones y Chinos', 'pantalones-y-chinos'),
(gen_random_uuid(), 'Abrigos y Chaquetas', 'abrigos-y-chaquetas'),
(gen_random_uuid(), 'Poleras', 'poleras'),
(gen_random_uuid(), 'Accesorios y Calzado', 'accesorios-y-calzado');

WITH 
   c_camisas AS (SELECT id, name FROM categories WHERE name = 'Camisas' LIMIT 1),
   c_pantalones AS (SELECT id, name FROM categories WHERE name = 'Pantalones y Chinos' LIMIT 1),
   c_abrigos AS (SELECT id, name FROM categories WHERE name = 'Abrigos y Chaquetas' LIMIT 1),
   c_poleras AS (SELECT id, name FROM categories WHERE name = 'Poleras' LIMIT 1),
   c_accesorios AS (SELECT id, name FROM categories WHERE name = 'Accesorios y Calzado' LIMIT 1)
-- El script se truncará aquí para ilustrar la creación. El frontend insertará los productos completos.
SELECT 1;
