import {View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './app.routes';

// Na transição de uma tela pra outra estiliza-se esta view se não o fundo fica branco

export function Routes(){
    return (
        <View className='flex-1 bg-background'>
            <NavigationContainer> 
                <AppRoutes />
            </NavigationContainer>
        </View>
    )
}