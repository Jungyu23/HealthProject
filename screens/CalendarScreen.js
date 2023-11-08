import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 운동 종류와 각 종류별 운동 목록을 정의합니다.
const workoutTypes = {
  전신: ['스쿼트', '버피', '덤벨 스윙'],
  상체: ['푸시업', '풀업', '벤치 프레스'],
  하체: ['런지', '레그 프레스', '데드리프트'],
};

const CalendarScreen = () => {
  // 선택된 날짜, 모달의 보임 상태, 입력된 운동 값 등을 상태로 관리합니다.
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workouts, setWorkouts] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [workoutType, setWorkoutType] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  // 현재 날짜와 다음 날짜를 계산합니다.
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 날짜를 클릭했을 때 호출되는 함수로 모달을 표시하고 선택된 날짜를 업데이트합니다.
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  // 컴포넌트가 마운트될 때 저장된 데이터를 불러오는 useEffect 훅입니다.
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@workouts')
        if (jsonValue != null) {
          setWorkouts(JSON.parse(jsonValue));
        }
      } catch(e) {
        // 데이터 불러오기 오류를 처리합니다.
        console.error('Error loading data', e);
      }
    };

    loadData();
  }, []);

   // 운동 정보를 저장하는 함수입니다.
   const storeData = async (newWorkouts) => {
    try {
      const jsonValue = JSON.stringify(newWorkouts)
      await AsyncStorage.setItem('@workouts', jsonValue)
    } catch (e) {
      // 데이터 저장 오류를 처리합니다.
      console.error('Error saving data', e);
    }
  };

  // 운동 정보를 저장하는 함수입니다.
  const handleSaveWorkoutDetail = () => {
    const newWorkouts = {
      ...workouts,
      [selectedDate]: {
        ...workouts[selectedDate],
        [workoutType]: { name: selectedWorkout, sets, reps },
      },
    };
    // 새로운 운동 정보를 AsyncStorage에 저장합니다.
    storeData(newWorkouts);
    setWorkouts(newWorkouts);
    setModalVisible(false);
    // 운동 유형, 선택된 운동, 세트, 횟수를 초기화합니다.
    setWorkoutType(null);
    setSelectedWorkout(null);
    setSets('');
    setReps('');
  };

  // 날짜에 해당하는 운동 정보를 렌더링합니다.
  // 저장된 운동 정보가 있으면 모든 운동 유형과 세트, 횟수를 문자열로 반환합니다.
  const renderWorkoutInfo = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const workoutData = workouts[dateString];
    let workoutInfo = '';
  
    if (workoutData) {
      Object.keys(workoutTypes).forEach((type) => {
        if (workoutData[type]) {
          const { name, sets, reps } = workoutData[type];
          workoutInfo += `${type}: ${name}, 세트: ${sets}, 횟수: ${reps}\n`;
        }
      });
    }
  
    return workoutInfo || '운동 계획 없음';
  };

  // 운동 유형 버튼을 클릭했을 때 호출되는 함수입니다.
  const handleWorkoutTypePress = (type) => {
    setWorkoutType(type);
  };

  // 특정 운동을 클릭했을 때 호출되는 함수입니다.
  const handleWorkoutPress = (workout) => {
    setSelectedWorkout(workout);
  };

  // 컴포넌트 렌더링 부분입니다.
  return (
    <View style={styles.container}>
        <Calendar
          current={selectedDate}
          minDate={'2023-01-01'}
          maxDate={'2029-12-31'}
          onDayPress={handleDayPress}
          monthFormat={'yyyy MM'}
          onMonthChange={(month) => { console.log('변경된 달', month); }}
        />
        {/* 모달 창을 통해 운동 유형과 세부 정보를 선택합니다. */}
        <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalView}>
          {/* 운동 유형을 선택하는 부분입니다. */}
          {workoutType === null && (
            <View>
              {Object.keys(workoutTypes).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.button}
                  onPress={() => handleWorkoutTypePress(type)}
                >
                  <Text style={styles.buttonText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {/* 선택한 운동 유형에 따라 운동 목록을 표시합니다. */}
          {workoutType !== null && selectedWorkout === null && (
            <View>
              {workoutTypes[workoutType].map((workout) => (
                <TouchableOpacity
                  key={workout}
                  style={styles.button}
                  onPress={() => handleWorkoutPress(workout)}
                >
                  <Text style={styles.buttonText}>{workout}</Text>
                </TouchableOpacity>
              ))}
              <Button title="뒤로" onPress={() => setWorkoutType(null)} />
            </View>
          )}
          {/* 운동의 세트와 횟수를 입력하는 부분입니다. */}
          {selectedWorkout !== null && (
            <View>
              <TextInput
                style={styles.input}
                value={sets}
                onChangeText={setSets}
                placeholder="세트"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                placeholder="횟수"
                keyboardType="numeric"
              />
              <Button title="저장" onPress={handleSaveWorkoutDetail} />
              <Button title="뒤로" onPress={() => setSelectedWorkout(null)} />
            </View>
          )}
        </View>
      </Modal>
      {/* 오늘과 내일의 운동 정보를 표시합니다. */}
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutTitle}>오늘의 운동</Text>
        <Text style={styles.workoutContent}>{renderWorkoutInfo(today)}</Text>
        <Text style={styles.workoutTitle}>내일의 운동</Text>
        <Text style={styles.workoutContent}>{renderWorkoutInfo(tomorrow)}</Text>
      </View>
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // 배경색을 조금 더 은은한 색으로 변경
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#ced4da', // 테두리 색상 변경
    padding: 10,
    width: '80%',
    backgroundColor: '#ffffff' // 배경색 추가
  },
  workoutInfo: {
    padding: 20,
    backgroundColor: '#ffffff', // 백그라운드 색상 추가
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  workoutTitle: {
    fontWeight: 'bold',
    fontSize: 18, // 폰트 사이즈 변경
    marginBottom: 5, // 마진 추가
    color: '#333333' // 색상 변경
  },
  workoutContent: {
    fontSize: 16, // 폰트 사이즈 변경
    color: '#555555' // 색상 변경
  },
  button: {
    backgroundColor: '#1e90ff', // 버튼 배경색 변경
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'white', // 버튼 텍스트 색상 변경
    fontSize: 16, // 폰트 사이즈 변경
    textAlign: 'center', // 텍스트 정렬 변경
  },
});

export default CalendarScreen;
