import emptyImg from '../assets/images/empty-questions.svg';

import '../styles/empty-question.scss';

export function EmptyQuestion() {
   return (
      <div className='empty-question'>
         <img src={emptyImg} alt="Nenhuma pergunta"/>
         <strong>Nenhuma pergunta por aqui...</strong>
         <span>Envie o código dessa sala para seus amigos e comece a responder perguntas!</span>
      </div>
   )
}