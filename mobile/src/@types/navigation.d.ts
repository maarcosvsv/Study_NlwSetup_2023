// Não é recomendado passar muitos parametrôs ou parametrôs pesados, apenas o necessário

export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            home: undefined,
            newHabit: undefined,
            habit: {
                date: string
            }
        }
    }
    
}