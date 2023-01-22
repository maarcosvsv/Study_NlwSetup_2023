import * as Popover from '@radix-ui/react-popover';
import { ProgressBar } from './ProgressBar';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { HabitsList } from './HabitsList';
import { useState } from 'react';

// Conceitos de acessibilidade -> Adicionado o progressbar do radix.
// clsx -> Receber vários parâmetros com classes.

interface HabitDayProps {
    date: Date
    amount?: number,
    initialCompleted?: number
}

export function HabitDay( {initialCompleted = 0, amount = 0, date}: HabitDayProps) {
    const [completed, setCompleted] = useState(initialCompleted);
    const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0;
    const dayAndMonth = dayjs(date).format('DD/MM');
    const dayOfWeek = dayjs(date).format('dddd');

    function handleCompletedChange(completed: number){
        setCompleted(completed);
    }

    return (
        <Popover.Root>
            <Popover.Trigger
                className={clsx('w-10 h-10  border-2  rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background' , {
                    'bg-zinc-900 border-zinc-800': completedPercentage === 0,
                    'bg-violet-200 border-violet-100': completedPercentage > 0 && completedPercentage < 20,
                    'bg-violet-300 border-violet-200': completedPercentage >= 20 && completedPercentage < 40,
                    'bg-violet-500 border-violet-400': completedPercentage >= 40 && completedPercentage < 60,
                    'bg-violet-700 border-violet-600': completedPercentage >= 60 && completedPercentage < 80,
                    'bg-violet-800 border-violet-700': completedPercentage >= 80 && completedPercentage < 95,
                    'bg-violet-900 border-violet-800': completedPercentage >= 95,
                })}


            />
            <Popover.Portal>
                <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col" >
                    <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
                    <span className='mt-1 font-extrabold leading-tight text-3xl'>{dayAndMonth}</span>

                    <ProgressBar progress={completedPercentage} />

                    <HabitsList date={date} onCompletedChanged={handleCompletedChange} />

                    <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>

    )
}