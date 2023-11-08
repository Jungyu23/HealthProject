import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  // 선택된 날짜 상태를 관리합니다. 초기값은 오늘 날짜입니다.
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workouts, setWorkouts] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // 오늘과 내일 날짜를 계산합니다.
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 모달을 보이게 하고, 선택된 날짜를 업데이트합니다.
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setInputValue(workouts[day.dateString]?.name || '');
    setModalVisible(true);
  };

  // 운동 계획을 저장합니다.
  const handleSaveWorkout = () => {
    setWorkouts({
      ...workouts,
      [selectedDate]: { name: inputValue.trim() }
    });
    setModalVisible(false); // 모달을 숨깁니다.
  };

  // 주어진 날짜 객체를 이용하여 ISO 문자열 형식으로 변환하고, 해당하는 운동 정보를 반환합니다.
  const renderWorkoutInfo = (date) => {
    const workout = workouts[date.toISOString().split('T')[0]];
    return workout ? workout.name : '운동 계획 없음';
  };

  return (
    <View style={styles.container}>
        <Calendar
          // 달력의 스타일 및 설정을 정의합니다.
          current={selectedDate}
          minDate={'2023-01-01'}
          maxDate={'2029-12-31'}
          // 날짜를 선택했을 때 실행할 함수를 정의합니다.
          onDayPress={handleDayPress}
          monthFormat={'yyyy MM'}
          // 달이 변경되었을 때 실행할 함수를 정의합니다.
          onMonthChange={(month) => { console.log('변경된 달', month); }}
        />
        <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder="운동 계획을 입력하세요"
          />
          <Button title="저장" onPress={handleSaveWorkout} />
          <Button title="취소" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
    backgroundColor: '#fff',
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
    padding: 10,
    width: '80%'
  },
  workoutInfo: {
    padding: 20,
    // 운동 정보 섹션 스타일을 여기에 추가합니다.
  },
  workoutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    // 운동 제목 스타일을 여기에 추가합니다.
  },
  workoutContent: {
    fontSize: 14,
    // 운동 내용 스타일을 여기에 추가합니다.
  },
  // 기타 필요한 스타일을 추가할 수 있습니다.
});

export default CalendarScreen;
