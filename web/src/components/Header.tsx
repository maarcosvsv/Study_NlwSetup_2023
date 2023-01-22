import {Plus, X} from 'phosphor-react';
import logoImage from '../assets/logo.svg';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { NewHabitForm } from './NewHabitForm';
// '-> Para não importar separado, faz desta forma assim a chamada fica: Dialog.root, etc.

// React se programa de uma maneira Declarativa -> Cria condição e reage a condição. Cria por exemplo uma informação
// verifica a informação após. (Ex.: Const isModalOpen -> Insere na tela caso seja verdade).
// React não fica observando alterações nas variáveis em tela. Quem fazia isso era versões antigas do AngularJS. Não performatico.
// Estado => Variáveis monitoradas pelo React (famoso state).
// radix-ui -> Controla automaticamente o estado de aberto ou fechado

//bg-black/80 cor + transparencia

export function Header() {
 /* const [isModalOpen, setIsModalOpen] = useState(false);

  function newHabit(){
    setIsModalOpen(true)
  }*/

    return (
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
        <img src={logoImage} alt="Habits" /> 

        <Dialog.Root>
          <Dialog.Trigger
            type="button"
            className="border border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-violet-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background">
            <Plus size={20} className="text-violet-500" />
            Novo Hábito
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />
            <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Dialog.Close className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900">
                <X size={24} aria-label='Fechar'/>
              </Dialog.Close>
              <Dialog.Title className="text-3xl leading-tight font-extrabold">Criar Hábito</Dialog.Title>
              
                <NewHabitForm />

            </Dialog.Content>
          </Dialog.Portal>

        </Dialog.Root>
      </div>
    )
}