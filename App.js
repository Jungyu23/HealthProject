import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarScreen from './screens/CalendarScreen';
import ChattingScreen from './screens/ChattingScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // 현재 경로에 따라 아이콘을 설정합니다.
            if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Test') {
              iconName = focused ? 'flask' : 'flask-outline'; // 정확한 아이콘 이름을 사용해야 합니다.
            }

            // 여기에서 원하는 컴포넌트를 반환할 수 있습니다!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Chatting" component={ChattingScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
