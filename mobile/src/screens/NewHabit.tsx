import { ScrollView, View, Text, TextInput, Button, TouchableOpacity, Alert } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { useState } from "react";
import { Feather } from '@expo/vector-icons';
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";
import { useNavigation } from "@react-navigation/native";

const avaiableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function NewHabit() {
    const { navigate } = useNavigation();
    const [title, setTitle] = useState('');

    const [weekDays, setWeekDays] = useState<number[]>([]);

    function handleToggleWeekDay(weekDayIndex: number) {
        if (weekDays.includes(weekDayIndex)) {
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex));
        } else {
            // Recuperar estado anterior: prevState;
            setWeekDays(prevState => [...prevState, weekDayIndex]);
        }
    }

    async function handleCreateNewHabit() {

        try {
            if (!title.trim()) {
                Alert.alert('Novo hábito', 'Informe o seu comprometimento!');
                return
            }

            if (weekDays.length == 0) {
                Alert.alert('Novo hábito', 'Informe a recorrência!');
                return
            }

            await api.post('/habits', {title, weekDays});

            setTitle('');
            setWeekDays([]);

            Alert.alert('Sucesso', 'Novo hábito criado com sucesso!');
            //navigate('home');
        } catch (error) {
            console.log(error);
            Alert.alert('Ops...', 'Não foi possível criar o novo hábito.')
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}>
                <BackButton />
                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar Hábito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    Qual seu comprometimento?
                </Text>

                <TextInput
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                    placeholder="Exercicíos, dormir bem, etc..."
                    placeholderTextColor={colors.zinc[400]}
                    value={title}
                    onChangeText={setTitle}
                />

                <Text className="mt-6 mb-3 text-white font-semibold text-base">
                    Qual a recorrência?
                </Text>

                {avaiableWeekDays.map((weekDay, index) => (
                    <Checkbox
                        key={weekDay}
                        title={weekDay}
                        checked={weekDays.includes(index)}
                        onPress={() => handleToggleWeekDay(index)} />
                ))}

                <TouchableOpacity
                    activeOpacity={0.7}
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                    onPress={handleCreateNewHabit}>
                    <Feather
                        name="check"
                        size={20}
                        color={colors.white}
                    />
                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>


                </TouchableOpacity>


            </ScrollView>
        </View>
    )
}