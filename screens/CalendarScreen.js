import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  // 선택된 날짜 상태를 관리합니다. 초기값은 오늘 날짜입니다.
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 오늘과 내일 날짜를 계산합니다.
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 날짜를 ISO 문자열 형식으로 변환합니다.
  const formattedToday = today.toISOString().split('T')[0];
  const formattedTomorrow = tomorrow.toISOString().split('T')[0];

  // 운동 스케줄 데이터를 객체로 정의합니다.
  const workouts = {
    [formattedToday]: { name: '5km 러닝' },
    [formattedTomorrow]: { name: '상체 근력 운동' },
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          // 달력의 스타일 및 설정을 정의합니다.
          current={formattedToday}
          minDate={'2023-01-01'}
          maxDate={'2029-12-31'}
          // 날짜를 선택했을 때 실행할 함수를 정의합니다.
          onDayPress={(day) => { setSelectedDate(day.dateString); }}
          monthFormat={'yyyy MM'}
          // 달이 변경되었을 때 실행할 함수를 정의합니다.
          onMonthChange={(month) => { console.log('변경된 달', month); }}
        />
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutTitle}>오늘의 운동</Text>
        <Text style={styles.workoutContent}>{workouts[formattedToday]?.name || '운동 계획 없음'}</Text>
        <Text style={styles.workoutTitle}>내일의 운동</Text>
        <Text style={styles.workoutContent}>{workouts[formattedTomorrow]?.name || '운동 계획 없음'}</Text>
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
  calendarContainer: {
    // 달력 컨테이너 스타일을 여기에 추가합니다.
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
