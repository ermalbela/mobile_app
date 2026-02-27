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
import axios from 'axios';
import { components } from 'react-select';
import { DatePickerModal } from 'react-native-paper-dates';
import { Button } from 'react-native-paper';

import { actors, directors, genres, languages } from '../../Menu';
import { addMovie } from '../../Endpoint';
import MySelect from '../CommonElements/MySelect';


const MovieForm = ({ setCreateMovie, setMovies, fetchData }) => {
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
  const [releaseDateText, setReleaseDateText] = useState('Select Release Date');
  const [imageText, setImageText] = useState("Select Movie Poster");
  const [videoText, setVideoText] = useState("Select Movie Video");

  const Option = props => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  const MultiValue = props => (
    <components.MultiValue {...props}>
      <p>{props.data.label}</p>
    </components.MultiValue>
  );

  const customStyles = {
    container: (provided) => ({
      ...provided,
      borderColor: 'rgb(164, 206, 212);',
      borderRadius: '4px',
      borderStyle: 'solid',
      borderWidth: '1px',
      margin: '0 0 10px 0'
    }),
    control: (provided) => ({
      ...provided,
      width: '100%',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
    }),
    valueContainer: (provided) => ({
      ...provided,
      display: 'flex',
      flexWrap: 'nowrap',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      msOverflowStyle: 'auto',
    }),
    multiValue: (provided) => ({
      ...provided,
      marginRight: '4px',
      maxHeight: '30px',
      margin: 0,
      minWidth: 'unset',
      height: '25px',
      padding: 0,
      alignItems: 'center'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      height: '100%'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      overflow: 'hidden'
    }),
    option: (styles, {isFocused, isSelected}) => {
      return{
        ...styles,
        backgroundColor: isSelected ? '#6ea4c2' : isFocused ? '#cee6e2' : '#fff',
        color: !isSelected ? '#000' : isSelected || isFocused ? '#000' : '',
        borderRadius: '5px'
      }
    }
  }

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) {
      setMovie({ ...movie, imageFile: res.assets[0].file, imageName: res.assets[0].fileName});
      setImageText(res.assets[0].fileName);
    }
  };

  const pickVideo = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
    });

    if (res.assets?.length) {
      setMovie({ ...movie, videoFile: res.assets[0].file, videoName: res.assets[0].name});
      setVideoText(res.assets[0].name);
    }
  };

  const submitMovie = async () => {
    if (!movie.title || !movie.plot || !movie.imageFile || !movie.videoFile) {
      window.alert('Error, Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', movie.title);
    formData.append('plot', movie.plot);
    // formData.append('Released', movie.released?.toISOString());
    formData.append('Released', '04/02/2024');
    formData.append('poster', 'http://localhost:5064/' + movie.imageName)
    formData.append('video', 'http://localhost:5064/' + movie.videoName)


    movie.genres.forEach(g => formData.append("genres", g.value));
    movie.actors.forEach(a => formData.append("actors", a.value));
    movie.directors.forEach(d => formData.append("directors", d.value));
    movie.languages.forEach(l => formData.append("languages", l.value));
    formData.append('ImageFile', movie.imageFile);
    formData.append('ImageName', movie.imageName);
    formData.append('VideoFile', movie.videoFile);
    formData.append('VideoName', movie.videoName);
  

    // formData.append('ImageFile', {
    //   uri: movie.imageFile.uri,
    //   name: movie.imageFile.fileName || 'poster.jpg',
    //   type: 'image/jpeg',
    // });

    // formData.append('VideoFile', {
    //   uri: movie.videoFile.uri,
    //   name: movie.videoFile.name || 'video.mp4',
    //   type: 'video/mp4',
    // });

    try {
      await axios.post(addMovie, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      window.alert('Success, Movie added successfully');
      setCreateMovie(false);
      fetchData();
    } catch (err) {
      window.alert('Error, Upload failed');
      console.log(err.response);
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

      <MySelect
        options={actors}
        styles={customStyles}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ Option, MultiValue }}
        onChange={(selected) => {
          setMovie({...movie, actors: selected});
        }}
        value={movie.actors}
        maxMenuHeight={"160px"}
        placeholder="Actors"
        isClearable
      />

      <MySelect
        options={genres}
        styles={customStyles}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ Option, MultiValue }}
        onChange={(selected) => {
          setMovie({...movie, genres: selected});
        }}
        value={movie.genres}
        maxMenuHeight={"160px"}
        placeholder="Genres"
        isClearable
      />

      <MySelect
        options={languages}
        styles={customStyles}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ Option, MultiValue }}
        onChange={(selected) => {
          setMovie({...movie, languages: selected});
        }}
        value={movie.languages}
        maxMenuHeight={"160px"}
        placeholder="Languages"
        isClearable
      />

      <Pressable onPress={() => setShowDate(true)} style={styles.button}>
        <Text>{releaseDateText}</Text>
      </Pressable>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={showDate}
        onDismiss={() => setShowDate(false)}
        date={movie.released}
        onConfirm={(params) => {
          setShowDate(false);
          setMovie({...movie, released: params.date});
          setReleaseDateText(params.date.toDateString());
        }}
      />

      <Pressable onPress={pickImage} style={styles.button}>
        <Text>{imageText}</Text>
      </Pressable>

      <Pressable onPress={pickVideo} style={styles.button}>
        <Text>{videoText}</Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable style={[styles.action_button, {backgroundColor: 'grey'}]} onPress={() => setCreateMovie(false)}>
          <Text style={{color: '#fff'}}>Cancel</Text>
        </Pressable>
        <Pressable style={[styles.action_button, {backgroundColor: '#24695c'}]} onPress={submitMovie}>
          <Text style={{color: '#fff'}}>Create</Text>
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
    width: '100%',
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
    marginTop: 10,
  },
  action_button: {
    padding: '10px',
    borderRadius: '8px',
    color: '#fff'
  }
});
