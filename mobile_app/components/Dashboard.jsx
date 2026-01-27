import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import Loader from '../Layout/Loader';
import MovieCard from './CommonElements/MovieCard';
import MovieForm from './Forms/MovieForm';
import axios from 'axios';
import AuthContext from '../_helper/AuthContext';
import { getMovies } from '../Endpoint';

const Dashboard = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [createMovie, setCreateMovie] = useState(false);

  const { role } = useContext(AuthContext);

  // Infinite scroll pagination
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const MOVIES_PER_PAGE = 12;

  async function fetchData(loadMore = false) {
    try {
      if (loadMore) setLoadingMore(true);

      const response = await axios.get(getMovies, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
        withCredentials: true
      });

      if (loadMore) {
        setMovies(prev => [...prev, ...response.data]);
      } else {
        setMovies(response.data);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setIsLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Load more when reaching bottom
  const handleLoadMore = () => {
    if (!loadingMore) {
      setPage(prev => prev + 1);
      fetchData(true);
    }
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { movieId: movie.id });
  };

  if (isLoading) return <Loader isLoading={isLoading} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {role === 'Superadmin' && (
        <View style={styles.addButtonContainer}>
          <Button title="Add Movie" onPress={() => setCreateMovie(true)} />
        </View>
      )}

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // 2 cards per row
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <MovieCard props={item} onPress={() => handleMoviePress(item)} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loadingMore ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      />

      {/* Modal for creating movie */}
      <Modal visible={createMovie} animationType="slide">
        <MovieForm setCreateMovie={setCreateMovie} setMovies={setMovies} />
      </Modal>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButtonContainer: {
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
