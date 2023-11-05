import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  return (
    <View style={styles.container}>
      <Calendar
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          textSectionTitleDisabledColor: '#d9e1e8',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: 'orange',
          disabledArrowColor: '#d9e1e8',
          monthTextColor: 'purple',
          indicatorColor: 'blue',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
        // 초기에 보여질 달. 기본값은 오늘 날짜입니다.
        current={new Date().toISOString().split('T')[0]}
        
        // 선택할 수 있는 최소 날짜, minDate 이전 날짜는 회색으로 표시됩니다. 기본값 = undefined
        minDate={'2023-01-01'}

        // 선택할 수 있는 최대 날짜, maxDate 이후 날짜는 회색으로 표시됩니다. 기본값 = undefined
        maxDate={'2029-12-31'}

        // 날짜를 선택할 때 실행될 함수. 기본값 = undefined
        onDayPress={(day) => { console.log('선택된 날짜', day) }}

        // 달력 제목에서 달을 형식에 맞추어 표시. 형식 값: http://arshaw.com/xdate/#Formatting
        monthFormat={'yyyy MM'}

        // 달력에서 보이는 달이 변경될 때 실행될 함수. 기본값 = undefined
        onMonthChange={(month) => { console.log('변경된 달', month) }}

        // 달의 이동 화살표를 숨깁니다. 기본값 = false
        hideArrows={false}

        // 달력 페이지에서 다른 달의 날짜를 보여주지 않습니다. 기본값 = false
        hideExtraDays={false}

        // firstDay=1이면 주는 월요일부터 시작합니다. 기본값 = 1
        firstDay={1}

        // 왼쪽에 주 번호를 표시합니다. 기본값 = false
        showWeekNumbers={false}

        // 달 사이를 스와이프로 이동하는 옵션을 활성화합니다. 기본값 = false
        enableSwipeMonths={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default CalendarScreen;
