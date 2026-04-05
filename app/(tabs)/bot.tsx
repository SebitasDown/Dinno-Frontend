import { View } from 'react-native';

export default function BotPlaceholderScreen() {
  // This screen is never actually shown because the tab button intercepts the press
  // and routes to the standalone app/chat.tsx instead.
  // It exists purely to satisfy Expo Router's requirement that every Tab.Screen
  // has a corresponding file.
  return <View />;
}
