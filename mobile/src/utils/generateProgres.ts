export function generateProgress(amount: number, completed: number){
    return Math.round((completed * 100) / amount)
}