import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const reviewSchema = z.object({
  product_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  reviewer_name: z.string().min(1).max(50),
  comment: z.string().max(500).optional().nullable(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('product_id') || searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) throw error

    const totalCount = reviews.length
    const averageRating = totalCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
      : 0

    return NextResponse.json({
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalCount
    })
  } catch (error) {
    console.error('[API Reviews GET] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = reviewSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.flatten() }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    const { product_id, rating, reviewer_name, comment } = validated.data

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        product_id,
        user_id: session?.user?.id || null,
        reviewer_name: session?.user?.user_metadata?.full_name || reviewer_name,
        rating,
        comment,
        verified_purchase: false, // Could be determined by checking orders in a real scenario
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('[API Reviews POST] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
