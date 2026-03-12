const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Faltan las variables de entorno de Supabase en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('Iniciando seed de Premium Menswear (Español Neutro)...')

  const categories = [
    { name: 'Camisas', slug: 'camisas' },
    { name: 'Pantalones y Chinos', slug: 'pantalones-y-chinos' },
    { name: 'Poleras', slug: 'poleras' },
    { name: 'Abrigos y Chaquetas', slug: 'abrigos-y-chaquetas' },
    { name: 'Accesorios y Calzado', slug: 'accesorios-y-calzado' },
    { name: 'Trajes Clásicos', slug: 'trajes-clasicos' }
  ]
  
  const { data: catData, error: catErr } = await supabase.from('categories').insert(categories).select()
  if (catErr) throw catErr

  const cCamisas = catData.find(c => c.name === 'Camisas').id
  const cPantalones = catData.find(c => c.name === 'Pantalones y Chinos').id
  const cPoleras = catData.find(c => c.name === 'Poleras').id
  const cAbrigos = catData.find(c => c.name === 'Abrigos y Chaquetas').id
  const cAccesorios = catData.find(c => c.name === 'Accesorios y Calzado').id
  const cTrajes = catData.find(c => c.name === 'Trajes Clásicos').id

  const products = [
    // Camisas
    { sku: 'CAM-LIN-001', name: 'Camisa de Lino Clásica', description: 'Confeccionada con algodón de la más alta calidad y lino italiano, ideal para climas cálidos y ocasiones informales.', price: 450, cost: 200, category_id: cCamisas, brand: 'Artisan Heritage', color: 'Blanco', sizes: ['S', 'M', 'L', 'XL'], colors: ['Blanco'] },
    { sku: 'CAM-LIN-002', name: 'Camisa de Lino Clásica', description: 'Confeccionada con algodón de la más alta calidad y lino italiano, ideal para climas cálidos y ocasiones informales.', price: 450, cost: 200, category_id: cCamisas, brand: 'Artisan Heritage', color: 'Beige', sizes: ['S', 'M', 'L', 'XL'], colors: ['Beige'] },
    { sku: 'CAM-OXF-001', name: 'Camisa Oxford Premium', description: 'Corte tradicional y durabilidad excepcional. Un básico esencial del guardarropa masculino.', price: 380, cost: 180, category_id: cCamisas, brand: 'Lukess Signature', color: 'Celeste', sizes: ['M', 'L', 'XL'], colors: ['Celeste'], is_new: true },
    { sku: 'CAM-OXF-002', name: 'Camisa Oxford Premium', description: 'Corte tradicional y durabilidad excepcional. Un básico esencial del guardarropa masculino.', price: 380, cost: 180, category_id: cCamisas, brand: 'Lukess Signature', color: 'Blanco', sizes: ['S', 'M', 'L'], colors: ['Blanco'], is_best_seller: true },
    { sku: 'CAM-FRA-001', name: 'Camisa de Franela Heritage', description: 'Franela cepillada suave, perfecta para el invierno o media estación.', price: 420, cost: 190, category_id: cCamisas, brand: 'Rustic Style', color: 'Rojo', sizes: ['M', 'L', 'XL'], colors: ['Rojo'] },
    { sku: 'CAM-FRA-002', name: 'Camisa de Franela Heritage', description: 'Franela cepillada suave, perfecta para el invierno o media estación.', price: 420, cost: 190, category_id: cCamisas, brand: 'Rustic Style', color: 'Gris oscuro', sizes: ['S', 'M', 'L'], colors: ['Gris oscuro'] },
    
    // Pantalones
    { sku: 'PAN-CHI-001', name: 'Pantalón Chino Slim Fit', description: 'Un ajuste entallado que proporciona un estilo moderno sin sacrificar comodidad.', price: 550, cost: 250, category_id: cPantalones, brand: 'Minimalist Sartorial', color: 'Negro', sizes: ['30', '32', '34', '36'], colors: ['Negro'], is_best_seller: true },
    { sku: 'PAN-CHI-002', name: 'Pantalón Chino Slim Fit', description: 'Un ajuste entallado que proporciona un estilo moderno sin sacrificar comodidad.', price: 550, cost: 250, category_id: cPantalones, brand: 'Minimalist Sartorial', color: 'Beige', sizes: ['30', '32', '34', '36'], colors: ['Beige'] },
    { sku: 'PAN-SAR-001', name: 'Pantalón de Vestir Sartorial', description: 'Hecho de lana liviana con un drapeado perfecto para la oficina y eventos elegantes.', price: 780, cost: 350, category_id: cTrajes, brand: 'Lukess Signature', color: 'Azul marino', sizes: ['32', '34', '36'], colors: ['Azul marino'] },
    { sku: 'PAN-SAR-002', name: 'Pantalón de Vestir Sartorial', description: 'Hecho de lana liviana con un drapeado perfecto para la oficina y eventos elegantes.', price: 780, cost: 350, category_id: cTrajes, brand: 'Lukess Signature', color: 'Gris', sizes: ['32', '34', '36', '38'], colors: ['Gris'] },
    { sku: 'PAN-JOG-001', name: 'Jogger Tech Urbano', description: 'Material elástico de alto rendimiento que no se arruga, ideal para estilo athleisure.', price: 480, cost: 210, category_id: cPantalones, brand: 'Urban Tech', color: 'Gris claro', sizes: ['S', 'M', 'L', 'XL'], colors: ['Gris claro'], is_new: true },
    
    // Poleras
    { sku: 'POL-PIM-001', name: 'Polera Pima Básica', description: '100% Algodón Pima peruano, el más suave del mercado, en un corte clásico (Regular Fit).', price: 250, cost: 110, category_id: cPoleras, brand: 'Pima Classics', color: 'Blanco', sizes: ['S', 'M', 'L', 'XL'], colors: ['Blanco'], is_best_seller: true },
    { sku: 'POL-PIM-002', name: 'Polera Pima Básica', description: '100% Algodón Pima peruano, el más suave del mercado, en un corte clásico (Regular Fit).', price: 250, cost: 110, category_id: cPoleras, brand: 'Pima Classics', color: 'Negro', sizes: ['S', 'M', 'L', 'XL'], colors: ['Negro'], discount: 15 },
    { sku: 'POL-PIM-003', name: 'Polera Pima Básica', description: '100% Algodón Pima peruano, el más suave del mercado, en un corte clásico (Regular Fit).', price: 250, cost: 110, category_id: cPoleras, brand: 'Pima Classics', color: 'Rosado', sizes: ['M', 'L', 'XL'], colors: ['Rosado'] },
    { sku: 'POL-HEN-001', name: 'Polera Henley Texturizada', description: 'Con botones al cuello y tejido acanalado para un look más robusto pero refinado.', price: 320, cost: 140, category_id: cPoleras, brand: 'Artisan Heritage', color: 'Verde militar', sizes: ['M', 'L', 'XL'], colors: ['Verde militar'] },
    { sku: 'POL-HEN-002', name: 'Polera Henley Texturizada', description: 'Con botones al cuello y tejido acanalado para un look más robusto pero refinado.', price: 320, cost: 140, category_id: cPoleras, brand: 'Artisan Heritage', color: 'Beige', sizes: ['S', 'M', 'L'], colors: ['Beige'] },

    // Abrigos y Chaquetas
    { sku: 'CHA-CUE-001', name: 'Chaqueta de Cuero Vintage', description: 'Cuero 100% genuino de oveja, con acabado envejecido y detalles metálicos premium.', price: 2400, cost: 1200, category_id: cAbrigos, brand: 'Lukess Signature', color: 'Marrón', sizes: ['M', 'L'], colors: ['Marrón'] },
    { sku: 'CHA-CUE-002', name: 'Chaqueta de Cuero Biker', description: 'Diseño clásico de motociclista con cierres asimétricos, corte slim ajustado.', price: 2600, cost: 1300, category_id: cAbrigos, brand: 'Lukess Signature', color: 'Negro', sizes: ['M', 'L', 'XL'], colors: ['Negro'], is_new: true },
    { sku: 'ABR-LAN-001', name: 'Abrigo Largo de Lana', description: 'Tejido pesado tipo gabardina larga, indispensable para dar un toque sofisticado en invierno.', price: 1800, cost: 800, category_id: cAbrigos, brand: 'Minimalist Sartorial', color: 'Azul marino', sizes: ['L', 'XL'], colors: ['Azul marino'] },
    { sku: 'CHA-BOM-001', name: 'Bomber Jacket Ligera', description: 'Chaquetilla casual de nailon repelente al agua, ideal para la ciudad de día y de noche.', price: 850, cost: 400, category_id: cAbrigos, brand: 'Urban Tech', color: 'Azul', sizes: ['S', 'M', 'L', 'XL'], colors: ['Azul'] },
    
    // Accesorios y Calzado
    { sku: 'ZAP-SNE-001', name: 'Sneakers Urbanos Minimalistas', description: 'Cuero blanco de alta gama con suela antideslizante, combinan con traje o con jeans.', price: 950, cost: 450, category_id: cAccesorios, brand: 'Urban Tech', color: 'Blanco', sizes: ['40', '41', '42', '43'], colors: ['Blanco'], is_best_seller: true },
    { sku: 'ZAP-CHE-001', name: 'Botines Chelsea de Gamuza', description: 'Gamuza repelente al agua y diseño icónico sin pasadores. Elegancia relajada.', price: 1250, cost: 600, category_id: cAccesorios, brand: 'Lukess Signature', color: 'Café', sizes: ['41', '42', '43'], colors: ['Café'] },
    { sku: 'ACC-REL-001', name: 'Reloj Cronógrafo Minimalista', description: 'Caja de acero inoxidable, cristal de zafiro y correa de malla metálica.', price: 1600, cost: 700, category_id: cAccesorios, brand: 'Minimalist Sartorial', color: 'Dorado', sizes: ['Unitalla'], colors: ['Dorado'] },
    { sku: 'ACC-CINT-001', name: 'Cinturón de Cuero Reversible', description: '100% cuero natural, girable para cambiar de lado de acuerdo al zapato.', price: 350, cost: 150, category_id: cAccesorios, brand: 'Lukess Signature', color: 'Negro', sizes: ['M', 'L'], colors: ['Negro'] },
    { sku: 'ACC-BMT-001', name: 'Billetera de Cuero RFID', description: 'Billetera ultra delgada con protección anti-clonación.', price: 280, cost: 120, category_id: cAccesorios, brand: 'Lukess Signature', color: 'Negro', sizes: ['Unitalla'], colors: ['Negro'], discount: 10 },
    
    // Added Trajes
    { sku: 'TRA-SUT-001', name: 'Traje Completo Tailored Fit', description: 'Conjunto de blazer y pantalón en lana tejida, para el ejecutivo moderno.', price: 3200, cost: 1500, category_id: cTrajes, brand: 'Lukess Signature', color: 'Azul marino', sizes: ['Drop 6 R', 'Drop 7 L'], colors: ['Azul marino'] },
    { sku: 'TRA-BLA-001', name: 'Blazer Casual de Algodón', description: 'Sin estructura rígida interior, te entrega un estilo relajado pero corporativo.', price: 1100, cost: 500, category_id: cTrajes, brand: 'Minimalist Sartorial', color: 'Beige', sizes: ['M', 'L', 'XL'], colors: ['Beige'] }
  ]

  const productDataToInsert = products.map(p => ({
    sku: p.sku,
    name: p.name,
    description: p.description,
    price: p.price,
    cost: p.cost,
    category_id: p.category_id,
    brand: p.brand,
    color: p.color,
    sizes: p.sizes,
    colors: p.colors,
    is_active: true,
    is_new: p.is_new || false,
    is_best_seller: p.is_best_seller || false,
    discount: p.discount || null
  }))

  const { data: insertedProducts, error: pErr } = await supabase.from('products').insert(productDataToInsert).select()
  if (pErr) throw pErr

  const { data: locationData } = await supabase.from('locations').select('id, name')
  const defaultLocation = locationData?.[0]?.id

  if (defaultLocation) {
    const inventoryData = []
    insertedProducts.forEach(prod => {
      if (prod.sizes) {
        prod.sizes.forEach(sz => {
          inventoryData.push({
            product_id: prod.id,
            location_id: defaultLocation,
            size: sz,
            quantity: Math.floor(Math.random() * 8) + 2
          })
        })
      } else {
        inventoryData.push({
          product_id: prod.id,
          location_id: defaultLocation,
          quantity: Math.floor(Math.random() * 8) + 2
        })
      }
    })

    const { error: invErr } = await supabase.from('inventory').insert(inventoryData)
    if (invErr) {
        console.error('Inventory error:', invErr)
        throw invErr
    }
  } else {
    console.warn('Advertencia: No se encontraron locations para crear inventario.')
  }

  console.log('Seed completado exitosamente con ' + products.length + ' productos.')
}

seed().catch(console.error)
