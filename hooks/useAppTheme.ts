import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useUserStore } from '@/store/userStore';

export const useAppTheme = () => {
    // 1. Get system preference
    const systemScheme = useColorScheme();
    
    // 2. Get user preference from Store
    const userDarkMode = useUserStore((state) => state.profile?.darkMode);
    const setProfile = useUserStore((state) => state.setProfile);
    
    // 3. Determine final theme
    // If logged in, use preference. Else use system.
    const isDark = userDarkMode ?? (systemScheme === 'dark');
    const theme = isDark ? 'dark' : 'light';

    const toggleTheme = async () => {
        const newMode = !isDark;
        await setProfile({ darkMode: newMode });
    };
    
    return {
        theme,
        isDark,
        colors: Colors[theme],
        toggleTheme,
    };
};
