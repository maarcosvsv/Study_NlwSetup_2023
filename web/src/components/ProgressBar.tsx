interface ProgressBarProps {
    progress: number
}

export function ProgressBar(props: ProgressBarProps){

    return (
        <div className='h-3 rounded-xl bg-zinc-700 w-full mt-4'>
                        <div 
                        role="progressbar"
                        aria-label='Progresso de hábitos completados neste dia'
                        aria-valuenow={props.progress}
                        className='h-3 rounded-xl bg-violet-700 w-3/4 transition-all'
                        style={{width: `${props.progress}%`}}>
                        </div>    
                    </div>
    )
}