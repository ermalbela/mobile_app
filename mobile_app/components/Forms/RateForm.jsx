import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { rateMovie } from '../../Endpoint';

const RateForm = ({ setAddRate, getMovie, movieId }) => {
  const [rate, setRate] = useState(0);
  const [error, setError] = useState('');


  const validate = (score) => {
    if (!score || score === 0) {
      return 'Please select a rating';
    }
    return '';
  };

  const handleRate = async () => {
    const validationError = validate(rate);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const userId = JSON.parse(localStorage.getItem('userId'));
      const token = localStorage.getItem('token');

      const res = await axios.post(
        rateMovie + movieId,
        { UserId: userId, Score: rate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);

      setAddRate(false);
      getMovie();
      window.alert('Success, Rating added.');
    } catch (err) {
        console.log(err.response);
        setError(err.response.data)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        How much do you like this movie?
      </Text>

      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRate(star)}>
            <Ionicons
              name={star <= rate ? 'star' : 'star-outline'}
              size={32}
              color={star <= rate ? '#facc15' : '#9ca3af'}
            />
          </Pressable>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => setAddRate(false)}
        >
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={handleRate}
        >
          <Text style={styles.buttonText}>Rate</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RateForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: '#24695c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
