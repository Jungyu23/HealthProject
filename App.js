import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarScreen from './screens/CalendarScreen';
import ChattingScreen from './screens/ChattingScreen';
import BMICalculator from './screens/BMICalculator';
import LiveHealthNavigator from './screens/LiveHealthNavigator';
import { Image } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Chatting') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'BMI') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Chatting" component={ChattingScreen} />
      <Tab.Screen name="BMI" component={BMICalculator} />
      <Tab.Screen name="Navigator" component={LiveHealthNavigator} options={{
            tabBarIcon: ({ color, size }) => (
              <Image source={require('./assets/map.png')} style={{ width: size, height: size }} />
            )
          }}/>
    </Tab.Navigator>
  );
};

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Main');
    }, 5000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/adaptive-icon.png')} // 이미지 경로와 이름을 여기에 넣으세요
        style={{ width: 200, height: 200 }} // 이미지 크기를 조절하세요
      />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App;
