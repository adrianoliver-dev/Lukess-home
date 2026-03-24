export const COLOR_MAP: Record<string, string> = {
  'Negro': '#000000',
  'Blanco': '#FFFFFF',
  'Gris': '#808080',
  'Gris Oscuro': '#4B5563',
  'Gris Claro': '#D1D5DB',
  'Beige': '#F5F5DC',
  'Crema': '#FFFDD0',
  'Rojo': '#DC2626',
  'Azul': '#2563EB',
  'Azul Marino': '#1E3A8A',
  'Celeste': '#38BDF8',
  'Verde': '#16A34A',
  'Verde Oliva': '#4D7C0F',
  'Marrón': '#8B4513',
  'Cafe': '#8B4513',
  'Rosado': '#F472B6',
  'Rosa': '#F472B6',
  'Dorado': '#D97706',
  'Plateado': '#9CA3AF',
  'Amarillo': '#EAB308',
  'Naranja': '#F97316',
  'Morado': '#9333EA',
  'Vino': '#7F1D1D',
  'Transparente': 'transparent', // Might need special border handling if transparent
};

export function getHexForColor(colorName: string): string {
  if (!colorName) return '#E5E7EB';
  const normalized = colorName.trim();
  const foundKey = Object.keys(COLOR_MAP).find(
    (key) => key.toLowerCase() === normalized.toLowerCase()
  );
  return foundKey ? COLOR_MAP[foundKey] : '#E5E7EB'; // Default gray-200
}
