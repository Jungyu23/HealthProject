import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';

// 운동 종류와 각 종류별 운동 목록을 정의합니다.
const workoutTypes = {
  전신: [
    { name: '버피', timeBased: false },
    { name: '마운틴 클라이머', timeBased: false },
    { name: '점프 스쿼트', timeBased: false },
    { name: '플랭크', timeBased: true },
    { name: '하이 니즈', timeBased: true },
    { name: '스타 점프', timeBased: false },
    { name: '크로스 잭', timeBased: false },
    { name: '인치웜', timeBased: false },
    { name: '스케이터 스텝', timeBased: false },
    { name: '스파이더맨 플랭크', timeBased: false },
  ],
  상체: [
    { name: '푸시업', timeBased: false },
    { name: '트라이셉스 딥스', timeBased: false },
    { name: '플랭크 숄더 탭', timeBased: true },
    { name: '다이아몬드 푸시업', timeBased: false },
    { name: '슈퍼맨', timeBased: true },
    { name: '베어 크롤', timeBased: true },
    { name: '팔벌려 뛰기', timeBased: false },
    { name: '플랭크 업다운', timeBased: false },
    { name: '파이크 푸시업', timeBased: false },
  ],
  하체: [
    { name: '스쿼트', timeBased: false },
    { name: '런지', timeBased: false },
    { name: '글루트 브릿지', timeBased: false },
    { name: '카프 레이즈', timeBased: false },
    { name: '월 시트', timeBased: true },
    { name: '사이드 런지', timeBased: false },
    { name: '돈키 킥', timeBased: false },
    { name: '서클 레그 리프트', timeBased: false },
    { name: '수퍼맨 레그 리프트', timeBased: false },
  ],
};

const CalendarScreen = () => {
  // 상태 변수들을 정의합니다.
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workouts, setWorkouts] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [workoutType, setWorkoutType] = useState(null); 
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [timeBased, setTimeBased] = useState(false); 
  const [duration, setDuration] = useState(''); 
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
          setMarkedDates(getMarkedDates(storedWorkouts));
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
        marked[date] = { marked: true, dotColor: 'blue' }; 
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
    const setsInt = parseInt(sets, 10);
    const repsInt = parseInt(reps, 10);
    const durationInt = parseInt(duration, 10);
    if (!workoutType) {
      Alert.alert('오류', '운동 유형을 선택해주세요.');
      return;
    }
    if (!selectedWorkout) {
      Alert.alert('오류', '구체적인 운동을 선택해주세요.');
      return;
    }
    if (timeBased) {
      if (!(durationInt > 0 && durationInt <= 180)) {
        Alert.alert('오류', '유효한 시간을 입력해주세요.(1~180초)');
        return;
      }
    } else {
      if (!(setsInt >= 1 && setsInt <= 100)) {
        Alert.alert('오류', '세트는 1 이상 100 이하로 입력해주세요.');
        return;
      }
  
      if (!(repsInt >= 1 && repsInt <= 100)) {
        Alert.alert('오류', '횟수는 1 이상 100 이하로 입력해주세요.');
        return;
      }
    }
    const workoutDetail = {
      type: workoutType,
      name: selectedWorkout.name,
      timeBased: selectedWorkout.timeBased,
      ...(timeBased ? { duration: durationInt } : { sets: setsInt, reps: repsInt }),
    };
    const newWorkouts = {
      ...workouts,
      [selectedDate]: [
        ...(workouts[selectedDate] || []),
        workoutDetail
      ],
    };
    storeData(newWorkouts);
    setWorkouts(newWorkouts);
    setModalVisible(false);
    setMarkedDates(getMarkedDates(newWorkouts));
    setSets('');
    setReps('');
    setDuration('');
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
      delete updatedWorkouts[dateString];
    }
    setWorkouts(updatedWorkouts);
    storeData(updatedWorkouts);
    setMarkedDates(getMarkedDates(updatedWorkouts));
    showToast('운동이 삭제되었습니다.');
  };

  // 토스트 메시지를 표시하는 함수
  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  // 운동 정보를 렌더링하는 함수
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
          <Text style={styles.workoutText}>
            {`${workout.type}: ${workout.name}, `}
            {workout.timeBased ? `지속 시간: ${workout.duration}초` : `세트: ${workout.sets}, 횟수: ${workout.reps}`}
          </Text>
        </TouchableOpacity>
      ));
    }

    return workoutInfoElements.length > 0 ? workoutInfoElements : <Text style={styles.workoutText}>운동 계획 없음</Text>;
  };

  // RNPickerSelect의 placeholder 옵션을 정의합니다.
  const placeholder = {
    label: '선택...',
    value: null,
    color: '#9EA0A4', 
  };

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
          onValueChange={(value) => {
            setWorkoutType(value);
            setSelectedWorkout(null);
          }}
          items={Object.keys(workoutTypes).map((type) => ({ label: type, value: type }))}
          placeholder={placeholder}
          value={workoutType}
          style={pickerSelectStyles}
        />
        {/* 구체적인 운동 선택 */}
        <Text>구체적인 운동 선택:</Text>
        <RNPickerSelect
          onValueChange={(value) => {
            const workoutObj = workoutTypes[workoutType]?.find(workout => workout.name === value);
            setSelectedWorkout(workoutObj);
            setTimeBased(workoutObj ? workoutObj.timeBased : false);
          }}
          items={workoutType ? workoutTypes[workoutType].map((workout) => ({
            label: workout.name,
            value: workout.name,
          })) : []}
          placeholder={placeholder}
          value={selectedWorkout ? selectedWorkout.name : ''}
          disabled={!workoutType}
          style={pickerSelectStyles}
        />
        {/* 세트 및 횟수 입력 필드 */}
          {
            timeBased ? (
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="시간 (초)"
                keyboardType="numeric"
                maxLength={3}
              />
            ) : (
              <>
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
              </>
            )
          }
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutTitle}>오늘의 운동</Text>
          {renderWorkoutInfo(new Date())}
          <Text style={styles.workoutTitle}>내일의 운동</Text>
          {renderWorkoutInfo(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))}
        </View>
      </ScrollView>
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
  workoutItem: {
    backgroundColor: '#fff', 
    padding: 5, 
    borderRadius: 2, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  workoutText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
    flexWrap: 'wrap', 
    marginBottom: 4,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  buttonWrapper: {
    marginHorizontal: 10,
  },
});

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
