import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);

  const calculateBMI = () => {
    const heightInMeters = height / 100; // 센티미터를 미터로 변환
    const bmiValue = weight / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(2)); // 소수점 둘째 자리까지 표시
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        placeholder="키 (cm)"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        placeholder="체중 (kg)"
        keyboardType="numeric"
      />
      <Button title="BMI 계산" onPress={calculateBMI} />
      {bmi && <Text style={styles.resultText}>당신의 BMI: {bmi}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default BMICalculator;
