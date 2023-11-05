import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Calendar
        // Collection of dates that have to be colored in a special way
        markedDates={{
          '2023-11-16': { selected: true, marked: true, selectedColor: 'blue' },
          '2023-11-17': { marked: true },
          '2023-11-18': { marked: true, dotColor: 'red', activeOpacity: 0 }
        }}
        // Handler which gets executed on day press
        onDayPress={(day) => { console.log('selected day', day) }}
        // Month format in calendar title
        monthFormat={'yyyy MM'}
        // Handler which gets executed when visible month changes in calendar
        onMonthChange={(month) => { console.log('month changed', month) }}
        // Hide month navigation arrows
        hideArrows={true}
        // Do not show days of other months in month page
        hideExtraDays={true}
        // If firstDay=1 week starts from Monday
        firstDay={1}
        // Show week numbers to the left
        showWeekNumbers={true}
        // Handler which gets executed when press arrow icon left
        onPressArrowLeft={subtractMonth => subtractMonth()}
        // Handler which gets executed when press arrow icon right
        onPressArrowRight={addMonth => addMonth()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});
