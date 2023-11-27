import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';

// 운동 종류와 각 종류별 운동 목록을 정의합니다.
const workoutTypes = {
  전신: ['버피', '마운틴 클라이머', '점프 스쿼트', '플랭크', '하이 니즈', '스타 점프', '크로스 잭', '인치웜', '스케이터 스텝', '스파이더맨 플랭크'],
  상체: ['푸시업', '트라이셉스 딥스', '플랭크 숄더 탭', '다이아몬드 푸시업', '슈퍼맨', '베어 크롤', '팔벌려 뛰기', '플랭크 업다운', '파이크 푸시업'],
  하체: ['스쿼트', '런지', '글루트 브릿지', '카프 레이즈', '월 시트', '사이드 런지', '돈키 킥', '서클 레그 리프트', '수퍼맨 레그 리프트'],
};

const CalendarScreen = () => {
  // 상태 변수들을 정의합니다.
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workouts, setWorkouts] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [workoutType, setWorkoutType] = useState(null); // 초기 운동 유형 설정
  const [selectedWorkout, setSelectedWorkout] = useState(null); // 초기 선택된 운동 설정
  const [markedDates, setMarkedDates] = useState({});
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  // 컴포넌트가 마운트될 때 AsyncStorage에서 데이터를 불러옵니다.
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@workouts');
        if (jsonValue != null) {
          const storedWorkouts = JSON.parse(jsonValue);
          setWorkouts(storedWorkouts);
          setMarkedDates(getMarkedDates(storedWorkouts)); // 마크된 날짜를 설정합니다.
        }
      } catch (e) {
        console.error('Error loading data', e);
      }
    };
    loadData();
  }, []);

  // AsyncStorage에 데이터를 저장하는 함수입니다.
  const storeData = async (newWorkouts) => {
    try {
      const jsonValue = JSON.stringify(newWorkouts);
      await AsyncStorage.setItem('@workouts', jsonValue);
    } catch (e) {
      console.error('Error saving data', e);
    }
  };

  // markedDates 객체를 생성하는 함수
  const getMarkedDates = (workouts) => {
    const marked = {};
    Object.keys(workouts).forEach(date => {
      if (workouts[date].length > 0) {
        marked[date] = { marked: true, dotColor: 'blue' }; // 예시로 파란색 점을 사용
      }
    });
    return marked;
  };

  // 날짜를 선택했을 때 호출되는 함수입니다.
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  // 운동 정보를 저장하는 함수입니다.
  const handleSaveWorkoutDetail = () => {
    // 세트와 횟수가 숫자인지, 그리고 1과 100 사이에 있는지 확인합니다.
    const setsInt = parseInt(sets, 10);
    const repsInt = parseInt(reps, 10);
    const isSetsValid = setsInt >= 1 && setsInt <= 100;
    const isRepsValid = repsInt >= 1 && repsInt <= 100;

    if (!workoutType || !selectedWorkout || !isSetsValid || !isRepsValid) {
      // 유효하지 않은 입력에 대한 오류 메시지를 출력합니다.
      Alert.alert('오류', '모든 필드를 채워주세요. 세트와 횟수는 1부터 100 사이의 숫자여야 합니다.');
      return;
    }

    // 입력값이 모두 유효한 경우에만 저장 로직을 계속 진행합니다.
    const newWorkouts = {
      ...workouts,
      [selectedDate]: [
        ...(workouts[selectedDate] || []),
        { type: workoutType, name: selectedWorkout, sets: setsInt, reps: repsInt }
      ],
    };
    storeData(newWorkouts);
    setWorkouts(newWorkouts);
    setModalVisible(false);
    setMarkedDates(getMarkedDates(newWorkouts)); // 운동 저장 후 마크된 날짜를 업데이트합니다.
    setSets('');
    setReps('');
  };

  // 운동을 삭제할 때의 확인 대화 상자를 띄우는 함수입니다.
  const confirmDeleteWorkout = (dateString, index) => {
    Alert.alert(
      "운동 삭제", 
      "이 운동을 삭제하시겠습니까?", 
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", onPress: () => deleteWorkout(dateString, index) }
      ]
    );
  };

  // 운동을 삭제하는 함수입니다.
  const deleteWorkout = (dateString, index) => {
    const updatedWorkouts = { ...workouts };
    updatedWorkouts[dateString].splice(index, 1);
    if (updatedWorkouts[dateString].length === 0) {
      delete updatedWorkouts[dateString]; // 해당 날짜의 운동이 더 이상 없으면 키 삭제
    }
    setWorkouts(updatedWorkouts);
    storeData(updatedWorkouts);
    setMarkedDates(getMarkedDates(updatedWorkouts)); // 운동 삭제 후 마크된 날짜를 업데이트합니다.
    showToast('운동이 삭제되었습니다.'); // 사용자에게 피드백을 제공합니다.
  };

  // 토스트 메시지를 표시하는 함수
  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message); // iOS의 경우 Alert 사용
    }
  };

  // 날짜에 해당하는 운동 정보를 렌더링하는 함수입니다.
  const renderWorkoutInfo = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const dailyWorkouts = workouts[dateString];
    let workoutInfoElements = [];

    if (dailyWorkouts && dailyWorkouts.length > 0) {
      workoutInfoElements = dailyWorkouts.map((workout, index) => (
        <TouchableOpacity
          key={index}
          style={styles.workoutItem}
          onPress={() => confirmDeleteWorkout(dateString, index)}
        >
          <Text style={styles.workoutText}>{`${workout.type}: ${workout.name}, 세트: ${workout.sets}, 횟수: ${workout.reps}`}</Text>
        </TouchableOpacity>
      ));
    }
  
    return workoutInfoElements.length > 0 ? workoutInfoElements : <Text style={styles.workoutContent}>운동 계획 없음</Text>;
  };

  // RNPickerSelect의 placeholder 옵션을 정의합니다.
  const placeholder = {
    label: '선택...',
    value: null,
    color: '#9EA0A4', // Placeholder 텍스트의 색상 (옵션)
  };

  // RNPickerSelect 컴포넌트의 스타일을 정의합니다.
  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });

  // 메인 화면 렌더링을 위한 코드
  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        minDate={'2023-01-01'}
        maxDate={'2029-12-31'}
        onDayPress={handleDayPress}
        monthFormat={'yyyy MM'}
        markedDates={markedDates}
        onMonthChange={(month) => { console.log('변경된 달', month); }}
      />

      {/* 운동 선택 및 세부 정보 입력을 위한 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          {/* 운동 종류 선택 */}
          <Text>운동 종류 선택:</Text>
          <RNPickerSelect
            onValueChange={(value) => setWorkoutType(value)}
            items={Object.keys(workoutTypes).map((type) => ({ label: type, value: type }))}
            placeholder={placeholder}
            value={workoutType}
            style={pickerSelectStyles}
          />
          {/* 구체적인 운동 선택 */}
          <Text>구체적인 운동 선택:</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedWorkout(value)}
            items={workoutType ? workoutTypes[workoutType].map((workout) => ({ label: workout, value: workout })) : []}
            placeholder={placeholder}
            value={selectedWorkout}
            disabled={!workoutType}
            style={pickerSelectStyles}
          />
          {/* 세트 및 횟수 입력 필드 */}
          <TextInput
            style={styles.input}
            value={sets}
            onChangeText={text => setSets(text.replace(/[^0-9]/g, ''))}
            placeholder="세트"
            keyboardType="numeric"
            maxLength={3}
          />
          <TextInput
            style={styles.input}
            value={reps}
            onChangeText={text => setReps(text.replace(/[^0-9]/g, ''))}
            placeholder="횟수"
            keyboardType="numeric"
            maxLength={3}
          />
          {/* 저장 및 취소 버튼 */}
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button title="저장" onPress={handleSaveWorkoutDetail} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="취소" onPress={() => setModalVisible(false)} color="#FF6347" />
            </View>
          </View>
        </View>
      </Modal>

      {/* 오늘과 내일의 운동 정보를 표시하는 부분 */}
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutTitle}>오늘의 운동</Text>
        <Text style={styles.workoutContent}>{renderWorkoutInfo(new Date())}</Text>
        <Text style={styles.workoutTitle}>내일의 운동</Text>
        <Text style={styles.workoutContent}>{renderWorkoutInfo(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))}</Text>
      </View>
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalView: {
    margin: 20,
    backgroundColor: "#f7f7f7",
    borderRadius: 25,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0.5,
    borderColor: '#e1e1e1',
    padding: 10,
    width: '80%',
    backgroundColor: '#fafafa'
  },
  workoutInfo: {
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2
  },
  workoutTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
    color: '#333333'
  },
  workoutContent: {
    fontSize: 16,
    color: '#333333'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  buttonWrapper: {
    marginHorizontal: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, 
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

export default CalendarScreen;
