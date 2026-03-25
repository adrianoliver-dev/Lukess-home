'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ShoppingBag, 
  Star, 
  Ruler, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Facebook, 
  Instagram, 
  Clock,
  Loader2,
  StarOff
} from 'lucide-react';
import { Product } from '@/lib/types';
import { Review } from '@/types/review';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/Button';
import Container from '@/components/ui/Container';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { addToCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Images logic
  const allImages = useMemo(() => {
    const images = [];
    if (product.image_url) images.push(product.image_url);
    if (product.thumbnail_url && product.thumbnail_url !== product.image_url) images.push(product.thumbnail_url);
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (!images.includes(img)) images.push(img);
      });
    }
    return images.length > 0 ? images : ['/placeholder.png'];
  }, [product]);

  // Fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${product.id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    }
    fetchReviews();
  }, [product.id]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  }, [reviews]);

  const totalReviews = reviews.length;
  const hasReviewed = useMemo(() => 
    isLoggedIn && reviews.some(r => r.user_id === user?.id),
  [isLoggedIn, reviews, user?.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || reviewRating === 0) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setReviewComment('');
        setReviewRating(0);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const validSizes = useMemo(() => {
    if (!product.inventory) return [];
    const sizes = (product.sizes || []).filter(s => s && s.trim() !== '');
    return sizes;
  }, [product.sizes, product.inventory]);

  // Auto-select single options
  useEffect(() => {
    if (validSizes.length === 1) setSelectedSize(validSizes[0]);
    if (product.colors && product.colors.length === 1) setSelectedColor(product.colors[0]);
  }, [validSizes, product.colors]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, selectedSize || undefined, selectedColor || undefined);
    setTimeout(() => setIsAdding(false), 2000);
  };

  const getStockForVariant = (size: string, color: string) => {
    if (!product.inventory) return 0;
    const variant = product.inventory.find(
      (v) => (size ? v.size === size : true) && (color ? v.color === color : true)
    );
    return variant?.quantity ?? 0;
  };

  const getTotalStock = (p: Product) => {
    if (!p.inventory) return 0;
    return p.inventory.reduce((sum, v) => sum + (v.quantity || 0), 0);
  };

  const stockAvailable = useMemo(() => {
    if (validSizes.length > 0 && !selectedSize) return getTotalStock(product);
    if (product.colors && product.colors.length > 0 && !selectedColor) return getTotalStock(product);
    return getStockForVariant(selectedSize, selectedColor);
  }, [product, selectedSize, selectedColor, validSizes.length]);

  const addToCartDisabled = 
    (validSizes.length > 0 && !selectedSize) || 
    (product.colors && product.colors.length > 0 && !selectedColor) || 
    stockAvailable <= 0;

  const addToCartLabel = stockAvailable <= 0 
    ? 'AGOTADO' 
    : isAdding 
      ? '✓ AGREGADO' 
      : 'AGREGAR AL CARRITO';

  const hasDiscount = (p: Product) => p.compare_at_price && p.compare_at_price > p.price;
  const getDiscount = (p: Product) => {
    if (!hasDiscount(p)) return 0;
    return Math.round(((p.compare_at_price! - p.price) / p.compare_at_price!) * 100);
  };

  const getPriceWithDiscount = (p: Product) => p.price;

  const normalizeText = (text: string) => 
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  return (
    <>
      <section className="pt-24 pb-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden group">
                <Image
                  src={allImages[activeImage]}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                />
                <AnimatePresence>
                  {hasDiscount(product) && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute top-6 right-6 bg-discount text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg z-10"
                    >
                      -{getDiscount(product)}% OFF
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 ${
                      activeImage === idx ? 'ring-2 ring-lukess-gold scale-95' : 'hover:opacity-75'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-lukess-gold uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
                    {product.brand}
                  </span>
                  {product.is_new && (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border border-gray-200 px-3 py-1 rounded-full">
                      New Arrival
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-baseline gap-4 mb-6">
                  <div className="text-3xl font-black text-gray-900">
                    Bs {product.price.toFixed(2)}
                  </div>
                  {hasDiscount(product) && (
                    <div className="text-lg text-gray-400 line-through font-medium">
                      Bs {product.compare_at_price?.toFixed(2)}
                    </div>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed text-sm lg:text-base mb-8 max-w-xl">
                  {product.description || 'Calidad premium garantizada. Esta prenda ha sido seleccionada cuidadosamente por Lukess Home para ofrecerte lo mejor en moda masculina.'}
                </p>

                {/* Variants */}
                <div className="space-y-8 mb-10">
                  {/* Colors - Only if defined */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Color: <span className="text-gray-900">{selectedColor || 'Selecciona'}</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {product.colors.map((color) => {
                          const isSelected = selectedColor === color;
                          const isAvailable = getStockForVariant(selectedSize, color) > 0;
                          return (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`group relative w-10 h-10 rounded-full border-2 p-1 transition-all duration-300 ${
                                isSelected ? 'border-lukess-gold scale-110 shadow-lg' : 'border-transparent hover:border-gray-200'
                              } ${!isAvailable && selectedSize ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                              <div className="w-full h-full rounded-full shadow-inner border border-black/5" style={{ backgroundColor: color.toLowerCase() }} />
                              {isSelected && (
                                <motion.div layoutId="color-ring" className="absolute -inset-1 border-2 border-lukess-gold rounded-full" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  {validSizes.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Talla: <span className="text-gray-900">{selectedSize || 'Selecciona'}</span>
                        </span>
                        <button 
                          onClick={() => setIsSizeGuideOpen(true)}
                          className="text-[10px] font-bold text-lukess-gold hover:underline flex items-center gap-1.5 uppercase tracking-widest"
                        >
                          <Ruler className="w-3.5 h-3.5" /> Guía de tallas
                        </button>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                        {validSizes.map((size) => {
                          const isSelected = selectedSize === size;
                          const isAvailable = getStockForVariant(size, selectedColor) > 0;
                          return (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              disabled={!isAvailable && !!selectedColor}
                              className={`relative py-3.5 text-xs font-bold rounded-xl border transition-all duration-300 overflow-hidden ${
                                isSelected 
                                  ? 'bg-gray-900 border-gray-900 text-white shadow-xl translate-y-[-2px]' 
                                  : isAvailable || !selectedColor
                                    ? 'bg-white border-gray-100 text-gray-900 hover:border-gray-900'
                                    : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                              }`}
                            >
                              {size}
                              {!isAvailable && selectedColor && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-full h-[1px] bg-gray-200 rotate-[35deg]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Button
                    onClick={handleAddToCart}
                    disabled={addToCartDisabled}
                    variant={isAdding ? 'success' : 'primary'}
                    className="flex-1 py-7 text-xs font-bold tracking-[0.2em] uppercase shadow-2xl shadow-lukess-gold/20"
                  >
                    {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {addToCartLabel}
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-lukess-gold shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Envío Gratis</p>
                      <p className="text-[10px] text-gray-400 truncate">Desde Bs 400</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-lukess-gold shrink-0">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Cambios</p>
                      <p className="text-[10px] text-gray-400 truncate">Hasta 7 días</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-lukess-gold shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Garantía</p>
                      <p className="text-[10px] text-gray-400 truncate">100% Original</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Productos Relacionados
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((p) => {
                  const relatedStock = getTotalStock(p)
                  return (
                    <Link
                      key={p.id}
                      href={`/producto/${p.id}`}
                      className="group"
                    >
                      <div className="relative aspect-[3/4] bg-white overflow-hidden mb-3">
                        <Image
                          src={p.thumbnail_url || p.image_url || '/placeholder.png'}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        {relatedStock === 0 && (
                          <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-0.5 text-xs font-semibold rounded-md">
                            AGOTADO
                          </div>
                        )}
                        {hasDiscount(p) && relatedStock > 0 && (
                          <div className="absolute top-2 right-2 bg-discount text-white px-2 py-0.5 text-xs font-semibold rounded-md">
                            -{getDiscount(p)}%
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                          {p.categories?.name}
                        </p>
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                          {p.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          {hasDiscount(p) ? (
                            <>
                              <span className="text-sm font-bold text-gray-900">
                                Bs {getPriceWithDiscount(p).toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                 Bs {p.price.toFixed(2)}
                               </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-gray-900">
                              Bs {p.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <hr className="my-16 border-gray-100" />

          {/* Reviews Section */}
          <div id="reviews" className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12">
              {/* Left: Summary */}
              <div className="md:w-1/3">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  Reseñas
                  {totalReviews > 0 && (
                    <span className="text-sm font-normal text-gray-400">({totalReviews})</span>
                  )}
                </h2>
                
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-black text-gray-900 mb-2">
                      {averageRating > 0 ? averageRating.toFixed(1) : '—'}
                    </div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${s <= Math.round(averageRating) ? 'fill-lukess-gold text-lukess-gold' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Calificación promedio</p>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviews.filter(r => r.rating === stars).length
                      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                      return (
                        <div key={stars} className="flex items-center gap-3 text-sm">
                          <span className="w-4 text-gray-600 font-medium">{stars}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-lukess-gold rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-gray-400 text-xs">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right: Reviews List & Form */}
              <div className="md:w-2/3 space-y-10">
                {/* Review Form */}
                {!hasReviewed && (
                  <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Escribe una reseña</h3>
                    {isLoggedIn ? (
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">Tu calificación:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setReviewRating(s)}
                                className="transition-transform hover:scale-110 active:scale-95"
                              >
                                <Star
                                  className={`w-7 h-7 ${s <= reviewRating ? 'fill-lukess-gold text-lukess-gold' : 'text-gray-300'}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="relative">
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value.slice(0, 500))}
                            placeholder="Cuéntanos tu experiencia con el producto..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-lukess-gold focus:bg-white transition-all min-h-[120px] resize-none"
                          />
                          <span className="absolute bottom-3 right-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/80 px-1.5 py-0.5 rounded-md">
                            {reviewComment.length}/500
                          </span>
                        </div>
                        <Button
                          type="submit"
                          disabled={isSubmittingReview || reviewRating === 0}
                          className="w-full py-4 text-xs font-bold tracking-widest uppercase"
                        >
                          {isSubmittingReview ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Publicar Reseña'
                          )}
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-sm mb-4">Para dejar una reseña, primero debes iniciar sesión.</p>
                        <Link 
                          href="/auth" 
                          className="inline-flex items-center gap-2 text-lukess-gold font-bold text-sm hover:underline underline-offset-4"
                        >
                          Ir a Iniciar Sesión <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {isLoadingReviews ? (
                    <div className="flex flex-col items-center py-10 gap-3">
                      <Loader2 className="w-10 h-10 text-gray-200 animate-spin" />
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Cargando reseñas...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <>
                      {reviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">{review.reviewer_name}</h4>
                              <div className="flex gap-0.5 mb-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${s <= review.rating ? 'fill-lukess-gold text-lukess-gold' : 'text-gray-200'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                              {new Date(review.created_at).toLocaleDateString('es-BO', { month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                          )}
                          {review.verified_purchase && (
                            <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-green-600 uppercase tracking-widest">
                              <div className="w-3.5 h-3.5 bg-green-100 rounded-full flex items-center justify-center">
                                <Star className="w-2 h-2 fill-green-600" />
                              </div>
                              Compra Verificada
                            </div>
                          )}
                        </div>
                      ))}
                      {reviews.length > 5 && (
                        <button className="w-full py-3 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-colors">
                          Ver todas las reseñas ({reviews.length})
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <StarOff className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-900 font-bold text-sm mb-1">Aún no hay reseñas</p>
                      <p className="text-gray-500 text-xs">Sé el primero en calificar este producto</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={(() => {
          const cat = normalizeText(product.categories?.name || '')
          if (cat.includes('pantalon') || cat.includes('jeans')) return 'inferior'
          if (cat.includes('short')) return 'shorts'
          if (cat.includes('cinturon') || cat.includes('belt')) return 'cinturones'
          if (cat.includes('gorra') || cat.includes('sombrero')) return 'gorras'
          return 'superior'
        })()}
      />

      {/* Sticky Mobile Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] md:hidden pointer-events-none">
        <div className="flex items-center justify-between p-4 gap-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-auto">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5 truncate">{product.brand}</p>
            <h3 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={addToCartDisabled}
            variant="primary"
            size="sm"
            className="h-11 px-6 text-[10px] whitespace-nowrap min-w-[140px]"
          >
            {addToCartLabel === 'AGREGAR AL CARRITO' ? 'COMPRAR' : addToCartLabel}
          </Button>
        </div>
      </div>
    </>
  )
}

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'superior' | 'inferior' | 'shorts' | 'cinturones' | 'gorras';
}

function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Guía de Tallas</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3">Talla</th>
                      {category === 'superior' ? (
                        <>
                          <th className="px-4 py-3">Pecho (cm)</th>
                          <th className="px-4 py-3">Largo (cm)</th>
                        </>
                      ) : category === 'inferior' ? (
                        <>
                          <th className="px-4 py-3">Cintura (cm)</th>
                          <th className="px-4 py-3">Cadera (cm)</th>
                        </>
                      ) : (
                        <th className="px-4 py-3">Medida (cm)</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {category === 'superior' ? (
                      <>
                        <tr><td className="px-4 py-3 font-bold text-gray-900">S</td><td className="px-4 py-3 text-gray-500">92-96</td><td className="px-4 py-3 text-gray-500">68</td></tr>
                        <tr><td className="px-4 py-3 font-bold text-gray-900">M</td><td className="px-4 py-3 text-gray-500">97-101</td><td className="px-4 py-3 text-gray-500">70</td></tr>
                        <tr><td className="px-4 py-3 font-bold text-gray-900">L</td><td className="px-4 py-3 text-gray-500">102-106</td><td className="px-4 py-3 text-gray-500">72</td></tr>
                        <tr><td className="px-4 py-3 font-bold text-gray-900">XL</td><td className="px-4 py-3 text-gray-500">107-111</td><td className="px-4 py-3 text-gray-500">74</td></tr>
                      </>
                    ) : (
                      <tr><td className="px-4 py-3 font-bold text-gray-900 text-center" colSpan={3}>Referencia estándar según marca</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-[10px] text-amber-800 font-bold uppercase tracking-widest mb-1">¿Tienes dudas?</p>
                <p className="text-xs text-amber-900/70">Las medidas son aproximadas y pueden variar según el corte de la prenda. Si estás entre dos tallas, te recomendamos elegir la mayor.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
