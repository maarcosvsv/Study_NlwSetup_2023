import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgress } from "../utils/generateProgres";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface Params {
    date: string;
}

interface DayInfoProps {
    completed: string[],
    possibleHabits: {
        id: string,
        title: string
    }[]
}


export function Habit() {
    const [loading, setLoading] = useState(true);
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);
    
    const route = useRoute();
    const { date } = route.params as Params;

    const parsedDate = dayjs(date);
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    const isDateInPast = parsedDate.endOf('day').isBefore(new Date());

    
    const habitProgress = dayInfo?.possibleHabits.length ? generateProgress(dayInfo?.possibleHabits.length, completedHabits.length) : 0;

    async function fetchHabits() {
        try {
            const response = await api.get('/day', { params: { date } });
            setDayInfo(response.data)
            setCompletedHabits(response.data.completedHabits)
            console.log(response.data)

        } catch (error) {
            console.log(error);
            Alert.alert('Ops...', 'Não foi possível carregar as informações dos hábitos');
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleHabit(habitId:string) {
        if(completedHabits.includes(habitId)){
            setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
        } else {
            setCompletedHabits(prevState => [...prevState, habitId]);
        }

        try {
            const response = await api.patch(`/habits/${habitId}/toggle`);
          
        } catch (error) {
            console.log(error);
            Alert.alert('Ops...', 'Não foi possível atualizar as informações do hábito');
        } finally {
            setLoading(false);
        }
        
    }

    useEffect(() => {
        fetchHabits();
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (


        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}>
                <BackButton />
                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={habitProgress} />

                <View className={clsx("mt-6", {
                    ["opacity-50"] : isDateInPast
                })}  >
                    {
                        dayInfo?.possibleHabits && dayInfo.possibleHabits.length > 0 ?
                        dayInfo?.possibleHabits.map((habit) => (
                            <Checkbox
                                key={habit.id}
                                title={habit.title}
                                checked={completedHabits.includes(habit.id)} 
                                activeOpacity={0.7}
                                disabled={isDateInPast}
                                onPress={() => handleToggleHabit(habit.id)} />
                        )) 
                        :  <HabitsEmpty />
                        
                        }

                </View>

                {isDateInPast && (
                    <Text className="text-white mt-10 text-center">
                        Você não pode editar hábitos passados.
                    </Text>
                )}

            </ScrollView>
        </View >


    )
}