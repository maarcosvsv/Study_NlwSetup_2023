import { View, Text, ScrollView, Alert } from "react-native";
import { Header } from "../components/Header";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { generateDaysFromYear } from "../utils/generateRanges";
import { useNavigation } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { api } from "../lib/axios";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";
import { useFocusEffect } from "@react-navigation/native";


const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYear = generateDaysFromYear();
const minimumSummaryDatesSize = 18 * 5.1;
const amountOfDayFill = minimumSummaryDatesSize - datesFromYear.length;

type SummaryProps = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number
}>

export function Home() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState< SummaryProps | null>([]);
    const { navigate } = useNavigation();


    async function fetchData() {
        try {
            setLoading(true);

            const response = await api.get('summary');
            setSummary(response?.data);


        } catch (error) {
            console.log(error);
            Alert.alert('Ops...', 'Não foi possível carregar o sumário de hábitos');
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchData();
    }, []));


    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        // flex-1: Ocupar todo espaço em tela
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />

            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, index) => (
                        <Text
                            key={`${weekDay}-${index}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: DAY_SIZE }}>
                            {weekDay}
                        </Text>
                    ))
                }

            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}>
                {
                    summary &&

                    <View className="flex-row flex-wrap">
                        {
                            datesFromYear.map(date => {
                                const dayWithHabit = summary?.find(day => {
                                    return dayjs(date).isSame(day.date, 'day')
                                })
                                return (
                                    <HabitDay
                                        key={date.toISOString()}
                                        date={date}
                                        amount={dayWithHabit?.amount}
                                        completed={dayWithHabit?.completed}
                                        onPress={() => navigate('habit', { date: date.toISOString() })}

                                    />
                                )
                            })
                        }
                        {
                            amountOfDayFill > 0 && Array
                                .from({ length: amountOfDayFill })
                                .map((_, index) => (
                                    <View
                                        key={index}
                                        className="bg-zinc-900 rounded-lg border-2, m-1 border-zinc-800 opacity-40"
                                        style={{ width: DAY_SIZE, height: DAY_SIZE }}
                                    />
                                ))
                        }
                    </View>
                }
            </ScrollView>
        </View>
    )
}