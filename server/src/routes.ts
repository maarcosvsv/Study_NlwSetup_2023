import {prisma} from './lib/prisma'
import { FastifyInstance } from 'fastify'
import {z} from 'zod'
import dayjs, { Dayjs } from 'dayjs'


/**
 * Método HTTP: Get, Post, Put, Patch, Delete
 * Patch -> Atualizar informação específica.
 */

export async function appRoutes(app: FastifyInstance){
    app.post('/habits', async (request) => {
        //title, days of week
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6)
            )
        })

        const {title, weekDays} = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                title, 
                created_at : today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay, 
                        }
                    })
                }
            } 
        })
    })

    app.get('/day', async (request) =>  {
        const getDayParams = z.object({
            date : z.coerce.date()
        })

        const {date} = getDayParams.parse(request.query)
        
        const parsedDate = dayjs(date).startOf('day')
        const weekDay = dayjs(date).get('day')

        const possibleHabits = await prisma.habit.findMany({
            where : {
                created_at: {
                    lte : date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
            }
        },

        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? []


        return {
            possibleHabits, completedHabits
        }
    })

    app.patch('/habits/:id/toggle', async (request) => {
        // route param => parâmetro de identificação
        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        })

        const {id} = toggleHabitParams.parse(request.params)

        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where : {
                date: today,
            }
        })

        if(!day){
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        if(dayHabit){
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id,
                }
            })
        } else {
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id,
                }
            })
        }

       

    })

    app.get('/summary', async () => {
        // Retornar um resumo, array com várias informações dentro desta lista. 
        // [ { date: 17/01, amount: 5, completed: 1 } ] -> Retorna os dias, com quantos hábitos possíveis e quantos hábitos completados. 
        // Query mais complexa, mais condições, relacionamentos => SQL na mão (RAW)
        // Prisma ORM: RAW SQL => SQLite (Exclusivamente pois cada banco tem suas particularidades) 
 
        // count(*) -> Do not know how to serialize a BigInt, bug do Prisma que não consegue serializar para JSON. Solução : CAST  * ERRO_Aula
        // strfTime função SQLite para formatar datas 

        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, 
                D.date,
                (
                    SELECT 
                        cast(count(DH.id) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM habit_week_days HWD 
                    JOIN habits H
                        ON H.id = HWD.habit_id AND H.created_at <= D.date
                    WHERE 
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                    
                ) as amount
            FROM days d


        `
        
        return summary;
    })
}

