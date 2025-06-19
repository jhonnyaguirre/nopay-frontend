'use client';

// utils/colors/getColorCode.tsx

/**
 * Devuelve el código hexadecimal correspondiente a un nombre de color.
 * Es usado para pintar elementos visuales como tarjetas, etiquetas, círculos, etc.
 */
export const getColorCode = (colorName: string): string => {
  const colors: Record<string, string> = {
    blanco: '#FFFFFF',
    negro: '#000000',
    gris: '#808080',
    gris_oscuro: '#404040',
    gris_claro: '#D3D3D3',
    plata: '#C0C0C0',
    plomo: '#A9A9A9',
    rojo: '#FF0000',
    rojo_oscuro: '#8B0000',
    azul: '#0000FF',
    azul_oscuro: '#00008B',
    azul_claro: '#ADD8E6',
    verde: '#008000',
    verde_oscuro: '#006400',
    verde_claro: '#90EE90',
    amarillo: '#FFFF00',
    amarillo_oscuro: '#CCCC00',
    naranja: '#FFA500',
    marron: '#8B4513',
    beige: '#F5F5DC',
    purpura: '#800080',
    morado: '#A020F0',
    rosado: '#FFC0CB',
    celeste: '#00CED1',
    vino: '#722F37',
    dorado: '#FFD700',
    coral: '#FF7F50',
    esmeralda: '#50C878',
    aqua: '#00FFFF',
    turquesa: '#40E0D0',
    lavanda: '#E6E6FA',
    mostaza: '#FFDB58',
    lima: '#BFFF00',
    cian: '#00FFFF',
    oliva: '#808000',
    teal: '#008080'
  };

  return colors[colorName.trim().toLowerCase()] || '#CCCCCC'; // color por defecto gris claro
};
