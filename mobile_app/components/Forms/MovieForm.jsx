import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

import { actors, directors, genres, languages } from '../../Menu';

const MovieForm = ({ setCreateMovie, setMovies }) => {
  const [movie, setMovie] = useState({
    title: '',
    plot: '',
    released: null,
    genres: [],
    actors: [],
    directors: [],
    languages: [],
    imageFile: null,
    videoFile: null,
  });

  const [showDate, setShowDate] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) {
      setMovie({ ...movie, imageFile: res.assets[0] });
    }
  };

  const pickVideo = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
    });

    if (res.assets?.length) {
      setMovie({ ...movie, videoFile: res.assets[0] });
    }
  };

  const submitMovie = async () => {
    if (!movie.title || !movie.plot || !movie.imageFile || !movie.videoFile) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', movie.title);
    formData.append('plot', movie.plot);
    formData.append('Released', movie.released?.toISOString());

    movie.genres.forEach(g => formData.append('genres', g));
    movie.actors.forEach(a => formData.append('actors', a));
    movie.directors.forEach(d => formData.append('directors', d));
    movie.languages.forEach(l => formData.append('languages', l));

    formData.append('ImageFile', {
      uri: movie.imageFile.uri,
      name: movie.imageFile.fileName || 'poster.jpg',
      type: 'image/jpeg',
    });

    formData.append('VideoFile', {
      uri: movie.videoFile.uri,
      name: movie.videoFile.name || 'video.mp4',
      type: 'video/mp4',
    });

    try {
      await axios.post('ADD_MOVIE_URL', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer TOKEN',
        },
      });

      Alert.alert('Success', 'Movie added successfully');
      setCreateMovie(false);
    } catch (err) {
      Alert.alert('Error', 'Upload failed');
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Movie</Text>

      <TextInput
        placeholder="Movie Title"
        style={styles.input}
        value={movie.title}
        onChangeText={(v) => setMovie({ ...movie, title: v })}
      />

      <TextInput
        placeholder="Plot"
        style={[styles.input, styles.textArea]}
        multiline
        value={movie.plot}
        onChangeText={(v) => setMovie({ ...movie, plot: v })}
      />

      <Pressable onPress={() => setShowDate(true)} style={styles.button}>
        <Text>Select Release Date</Text>
      </Pressable>

      {showDate && (
        <DateTimePicker
          value={movie.released || new Date()}
          mode="date"
          onChange={(_, date) => {
            setShowDate(false);
            setMovie({ ...movie, released: date });
          }}
        />
      )}

      <Pressable onPress={pickImage} style={styles.button}>
        <Text>Select Poster Image</Text>
      </Pressable>

      <Pressable onPress={pickVideo} style={styles.button}>
        <Text>Select Movie Video</Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable onPress={() => setCreateMovie(false)}>
          <Text>Cancel</Text>
        </Pressable>
        <Pressable onPress={submitMovie}>
          <Text>Create</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default MovieForm;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
