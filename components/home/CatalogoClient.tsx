'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, X, Loader2, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface CatalogoClientProps {
  initialProducts: Product[];
}

export default function CatalogoClient({ initialProducts }: CatalogoClientProps) {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if product has meaningful variants (sizes or colors)
    const hasVariants = (product.sizes && product.sizes.length > 0 && product.sizes.some(s => !['Unitalla', 'Única', 'Unico'].includes(s))) || 
                       (product.colors && product.colors.length > 0);

    if (hasVariants) {
      setSelectedProduct(product);
      setIsQuickAddOpen(true);
    } else {
      // Direct add for simple products
      const size = product.sizes?.[0];
      const color = product.colors?.[0];
      addToCart(product, size, color);
      
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 1500);
    }
  };

  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    addToCart(product, size, color);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <div className="bg-[#fcfcfc] py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {initialProducts.map((product) => {
            const hasVariants = (product.sizes && product.sizes.length > 0 && product.sizes.some(s => !['Unitalla', 'Única', 'Unico'].includes(s))) || 
                               (product.colors && product.colors.length > 0);
            
            const isAdded = addedProductId === product.id;

            return (
              <div key={product.id} className="group relative bg-white rounded-lg p-2 transition-all hover:shadow-xl">
                <Link href={`/producto/${product.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-md mb-4 bg-gray-50">
                  <Image
                    src={product.thumbnail_url || product.image_url || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay for Desktop */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/20 to-transparent flex flex-col gap-2 hidden md:flex">
                    <Button 
                      variant="primary" 
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="w-full text-[10px] tracking-widest font-bold h-10"
                    >
                      {isAdded ? '✓ AGREGADO' : hasVariants ? 'VER OPCIONES' : 'COMPRA RÁPIDA'}
                    </Button>
                  </div>
                </Link>

                <div className="px-2 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-lukess-gold uppercase tracking-widest">{product.brand}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-gray-900">Bs {product.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Mobile Button - Static at bottom */}
                <div className="md:hidden mt-2">
                  <Button 
                    variant={isAdded ? "success" : "primary"}
                    fullWidth 
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="text-[9px] tracking-widest font-bold h-10 py-0"
                  >
                    {isAdded ? '✓ AGREGADO' : hasVariants ? 'VER OPCIONES' : 'COMPRAR'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        product={selectedProduct!}
        onAdd={handleAddToCart}
      />
    </div>
  );
}

function QuickAddModal({
  product,
  isOpen,
  onClose,
  onAdd
}: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product, size?: string, color?: string) => void;
}) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const validSizes = (product.sizes ?? []).filter(
    (s: string) => s && s.trim() !== '' && !['Unitalla', 'Única', 'Unico'].includes(s)
  );

  useEffect(() => {
    if (isOpen) {
      if (validSizes.length === 1) setSelectedSize(validSizes[0]);
      if (product.colors && product.colors.length === 1) setSelectedColor(product.colors[0]);
    } else {
      setSelectedSize('');
      setSelectedColor('');
    }
  }, [isOpen, product.id, product.colors, validSizes.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const isAddDisabled = !!((validSizes.length > 0 && !selectedSize) || (product.colors && product.colors.length > 0 && !selectedColor));

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
            className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="relative w-16 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <Image
                      src={product.thumbnail_url || product.image_url || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight mb-1">{product.name}</h3>
                    <p className="text-sm font-bold text-lukess-gold">Bs {product.price.toFixed(2)}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {validSizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Talla</p>
                  <div className="grid grid-cols-4 gap-2">
                    {validSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'bg-gray-900 border-gray-900 text-white shadow-md'
                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Color: <span className="text-gray-900">{selectedColor}</span></p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`group relative w-8 h-8 rounded-full border-2 p-0.5 transition-all ${
                            isSelected ? 'border-lukess-gold scale-110' : 'border-transparent hover:border-gray-200'
                          }`}
                        >
                          <div className="w-full h-full rounded-full border border-black/5" style={{ backgroundColor: color.toLowerCase() }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <Button
                onClick={() => {
                  onAdd(product, selectedSize || undefined, selectedColor || undefined);
                  onClose();
                }}
                disabled={isAddDisabled}
                fullWidth
                className="py-6 text-xs font-bold tracking-widest uppercase"
              >
                Agregar al Carrito
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
