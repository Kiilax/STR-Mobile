import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import StackNav from './src/navigation/stackNav';

export default function App() {
  return (
    <NavigationContainer>
      <StackNav />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}