import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export function HabitsEmpty() {
    const { navigate } = useNavigation();
    return (
        <Text className="text-zinc-400 text-base">
            Você não está monitorando nenhum hábito nesta data. 
            <Text className="text-violet-400 text-base underline pl-2"
                onPress={() => navigate('newHabit')}>
               Cadastre um aqui.

            </Text>
        </Text>



    )
}