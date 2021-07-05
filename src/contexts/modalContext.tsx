import { createContext, ReactNode, useState } from 'react';

type ModalContextProviderProps = {
   children: ReactNode;
}

type ModalContextType = {
   toggleModalDelete: ()=> void;
   toggleModalClose: ()=> void;
   showModalDelete: boolean;
   showModalClose: boolean;
}

export const ModalContext = createContext({} as ModalContextType);

export function ModalContextProvider ({ children }: ModalContextProviderProps) {
   const [ showModalDelete, setShowModalDelete ] = useState(false);
   const [ showModalClose, setShowModalClose ] = useState(false);

   function toggleModalDelete(){
      setShowModalDelete(!showModalDelete)
   }

   function toggleModalClose(){
      setShowModalClose(!showModalClose)
   }

   return (
      <ModalContext.Provider 
         value={{
            toggleModalDelete,
            toggleModalClose,
            showModalClose,
            showModalDelete
         }}
      >
         {children}
      </ModalContext.Provider>
   )
}

