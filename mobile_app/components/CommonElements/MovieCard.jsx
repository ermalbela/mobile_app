import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

const MovieCard = ({ props, onPress }) => {
  const posterUri = props.poster ?? 'https://via.placeholder.com/150'; // fallback image

  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={onPress}>
      <ImageBackground
        source={{ uri: posterUri }}
        style={styles.poster}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.genres}>
            {props.genres
              .map((g) => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase())
              .join(', ')}
          </Text>
          <Text style={styles.released}>
            {new Date(props.released).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default MovieCard;

const styles = StyleSheet.create({
  cardWrapper: {
    width: 130,
    height: 230,
    margin: 8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  poster: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  genres: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  released: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
  },
});
