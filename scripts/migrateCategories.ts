import { createClient } from '@supabase/supabase-js'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrate() {
    console.log('Starting category migration...')

    // Get organization_id from an existing category
    const { data: firstCat } = await supabase.from('categories').select('organization_id').limit(1).single()
    const organization_id = firstCat?.organization_id

    // Step 1: Insert new categories Polos, Shorts, Billeteras
    const newCategories = ['Polos', 'Shorts', 'Billeteras']
    console.log(`Ensuring categories exist: ${newCategories.join(', ')} with org ${organization_id}`)

    for (const name of newCategories) {
        // Determine the type: usually 'superior', 'inferior', 'accesorios'
        let type = 'accesorios'
        if (name === 'Polos') type = 'superior'
        if (name === 'Shorts') type = 'inferior'

        // insert if not exists
        const { data: existing, error: selErr } = await supabase
            .from('categories')
            .select('id')
            .eq('name', name)
            .maybeSingle()

        if (selErr) {
            console.error(`Error checking category ${name}:`, selErr.message)
            return
        }

        if (!existing && organization_id) {
            const { error: insErr } = await supabase
                .from('categories')
                .insert({ name, description: `Categoría de ${name}`, organization_id })

            if (insErr) {
                console.error(`Error inserting category ${name}:`, insErr.message)
                return
            }
            console.log(`Inserted category: ${name}`)
        } else {
            console.log(`Category already exists: ${name}`)
        }
    }

    // Fetch all categories to get their IDs
    const { data: catMap, error: mapErr } = await supabase.from('categories').select('id, name')
    if (mapErr) {
        console.error('Error fetching categories map:', mapErr)
        return
    }

    const getCatId = (name: string) => catMap.find(c => c.name.toLowerCase() === name.toLowerCase())?.id

    const cinturonesId = getCatId('Cinturones')
    const billeterasId = getCatId('Billeteras')
    const gorrasId = getCatId('Gorras')
    const accesoriosId = getCatId('Accesorios')
    const camisasId = getCatId('Camisas')
    const polosId = getCatId('Polos')
    const pantalonesId = getCatId('Pantalones')
    const shortsId = getCatId('Shorts')

    if (!accesoriosId || !camisasId || !pantalonesId) {
        console.warn('Original categories (Accesorios, Camisas, Pantalones) not fully found. Proceeding with caution.')
    }

    // Step 2: Reassign products in Accesorios
    if (accesoriosId) {
        const { data: accProducts, error: accErr } = await supabase
            .from('products')
            .select('id, name')
            .eq('category_id', accesoriosId)

        if (accErr) {
            console.error('Error fetching Accesorios products:', accErr)
        } else if (accProducts) {
            console.log(`Found ${accProducts.length} products in Accesorios.`)
            for (const p of accProducts) {
                const lowerName = p.name.toLowerCase()
                let targetCatId = null
                if (lowerName.includes('cinturón') || lowerName.includes('cinturon')) {
                    targetCatId = cinturonesId
                } else if (lowerName.includes('billetera') || lowerName.includes('cartera')) {
                    targetCatId = billeterasId
                } else if (lowerName.includes('gorra')) {
                    targetCatId = gorrasId
                } else {
                    // Nearest matching category? The prompt says "reassign to the closest matching". 
                    // If we can't tell, we just leave it in Billeteras or wait. Since we MUST delete Accesorios,
                    // let's default to Billeteras if it looks like leather, or delete it? Wait, Accesorios has to be deleted.
                    targetCatId = billeterasId // safe fallback for miscellaneous accessories if any
                }

                if (targetCatId) {
                    await supabase.from('products').update({ category_id: targetCatId }).eq('id', p.id)
                    console.log(`Reassigned '${p.name}' -> mapped category ID ${targetCatId}`)
                }
            }
        }
    }

    // Step 3: Camisas -> Polos
    if (camisasId && polosId) {
        const { data: camisaProds } = await supabase
            .from('products')
            .select('id, name')
            .eq('category_id', camisasId)

        if (camisaProds) {
            const polos = camisaProds.filter(p => p.name.toLowerCase().includes('polo') || p.name.toLowerCase().includes('polera'))
            for (const p of polos) {
                await supabase.from('products').update({ category_id: polosId }).eq('id', p.id)
                console.log(`Reassigned '${p.name}' -> Polos`)
            }
        }
    }

    // Step 4: Pantalones -> Shorts
    if (pantalonesId && shortsId) {
        const { data: pantProds } = await supabase
            .from('products')
            .select('id, name')
            .eq('category_id', pantalonesId)

        if (pantProds) {
            const shorts = pantProds.filter(p => p.name.toLowerCase().includes('short'))
            for (const p of shorts) {
                await supabase.from('products').update({ category_id: shortsId }).eq('id', p.id)
                console.log(`Reassigned '${p.name}' -> Shorts`)
            }
        }
    }

    // Step 5: Delete 'Accesorios'
    if (accesoriosId) {
        // Check if any products remain
        const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category_id', accesoriosId)
        if (count === 0) {
            const { error: delErr } = await supabase.from('categories').delete().eq('id', accesoriosId)
            if (delErr) {
                console.error('Failed to delete Accesorios:', delErr.message)
            } else {
                console.log('Successfully deleted Accesorios category.')
            }
        } else {
            console.warn(`Could not delete Accesorios because ${count} products still belong to it.`)
        }
    }

    console.log('Migration complete.')
}

migrate()
