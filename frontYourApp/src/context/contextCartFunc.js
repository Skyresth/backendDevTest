import { useContext } from 'react';
import { CartContext } from './CartContext';

export function contextCartFunc() {
  return useContext(CartContext);
}
