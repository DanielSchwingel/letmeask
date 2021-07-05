import { useContext } from 'react';
import { ModalContext } from '../contexts/modalContext';

export function useModal() {
   const value = useContext(ModalContext);

   return value;
}