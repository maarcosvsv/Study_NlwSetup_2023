import { useEffect, useState } from "react"
import { generateDaysFromYear } from "../utils/generateRanges"
import { HabitDay } from "./HabitDay"
import { api } from "../libs/axios"
import { Summary } from "../models/Summary"
import dayjs from "dayjs"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summeryDates = generateDaysFromYear()
const minimumSummaryDatesSize = 18 * 7 // 18 weeks
const amountOfDaysFill = minimumSummaryDatesSize - summeryDates.length


export function SummaryTable() {
    const [summary, setSummary] = useState<Summary>([]);

    useEffect(() => {
        api.get('summary').then((response) => {
            setSummary(response.data)
        })
    }, [])

    return (
        <div className="w-full flex" >
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekDays.map((weekDay, index) => {
                    return (
                        <div key={`${weekDay}-${index}`} className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">
                            {weekDay}
                        </div>
                    )
                })}
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-3">
                { summary.length > 0 && summeryDates.map(date => {
                    const dayInSummary = summary.find(day => {
                        return dayjs(date).isSame(day.date, 'day');
                    })
                    return (
                        <HabitDay
                            key={date.toString()}
                            date={date}
                            amount={dayInSummary?.amount}
                            initialCompleted={dayInSummary?.completed} />)
                })}

                {amountOfDaysFill > 0 && Array.from({ length: amountOfDaysFill }).map((_, index) => {
                    return (<div key={index} className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" ></div>)
                })}




            </div>
        </div>


    )
}