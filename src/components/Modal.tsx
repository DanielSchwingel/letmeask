import { useHistory } from 'react-router';

import { useModal } from '../hooks/useModal';
import { database } from '../services/firebase';

import deleteImg from '../assets/images/delete-modal.svg';
import closeImg from '../assets/images/close-modal.svg';

import '../styles/modal.scss';

type ModalProps = {
   roomId: string;
   questionId?: string;
   type: 'DELETE' | 'CLOSE'
}


export function Modal({ roomId, questionId, type }: ModalProps) {
   const history = useHistory();
   const { toggleModalClose, toggleModalDelete } = useModal();

   async function handleDeleteQuestion() {
      await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove()
      toggleModalDelete();
   }

   async function handleCloseRoom(){
      await database.ref(`/rooms/${roomId}`).update({
         closedAt: new Date()
      })
      toggleModalClose();
      history.push('/');
   }

   return (
      <div className='overlay'>
         <div className='modal'>
            <img src={type === 'CLOSE' ? closeImg : deleteImg} alt='Ícone do modal' />
            <main>
               <p>
                  {type === 'CLOSE' ? 
                     'Encerrar sala' 
                  : 
                     'Excluir pergunta'}
               </p>
               <span>
                  {type === 'CLOSE' ? 
                     'Tem certeza que você deseja encerrar esta sala?' 
                  : 
                     'Tem certeza que você deseja excluir esta sala?'}
               </span>
            </main>
            <footer>
               <button
                  className='button-cancel'
                  type='button'
                  onClick={type === 'CLOSE' ? toggleModalClose : toggleModalDelete}
               >
                  Cancelar
               </button>
               <button
                  className='button-confirm'
                  type='button'
                  onClick={type === 'CLOSE' ? handleCloseRoom : handleDeleteQuestion}
               >
                  {type === 'CLOSE' ? 
                     'Sim, encerrar' 
                  : 
                     'Sim, excluir'}
               </button>
            </footer>
         </div>
      </div>
   )
}