import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import Loader from '../Layout/Loader';
import MovieCard from './CommonElements/MovieCard';
import MovieForm from './Forms/MovieForm';
import axios from 'axios';
import AuthContext from '../_helper/AuthContext';
import { getLimitedMovies, getMovies } from '../Endpoint';
import LoadingContext from '../_helper/LoadingContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = ({ navigation }) => {
  const {loading, setLoading} = useContext(LoadingContext)
  const [createMovie, setCreateMovie] = useState(false);

  const { role } = useContext(AuthContext);

  // Infinite scroll pagination
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const MOVIES_PER_PAGE = 8;

  
  const fetchData = async (loadMore = false) => {
    try {
      if (loadMore) setLoadingMore(true);
      else setLoading(true);

      const token = localStorage.getItem("token");
      const response = await axios.get(getLimitedMovies, {
        params: { page, limit: MOVIES_PER_PAGE },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);
      if (loadMore) {
        setMovies(prev => [...prev, ...response.data]);
      } else {
        setMovies(response.data);
      }
      if (response.data.length < MOVIES_PER_PAGE) setHasMore(false);

      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
  };


  useEffect(() => {
    fetchData(page === 1 ? false : true);
    setLoading(false);
  }, [page]);

  // Load more when reaching bottom
  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    setPage(prev => prev + 1);
  };


  const handleMoviePress = (movie) => {
    console.log(movie);
    navigation.navigate('MovieWatcher', { id: movie.id });
  };

  return loading ? <Loader /> : (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <Text style={styles.title}>Dashboard</Text>

        {role === 'Superadmin' && (
          <View style={styles.addButtonContainer}>
            <Button title="Add Movie" onPress={() => setCreateMovie(true)} />
          </View>
        )}
      </View>
      
      <View style={{height: '80vh'}}>
        <FlatList
          data={movies}
          keyExtractor={(item, idx) => idx.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <MovieCard props={item} onPress={() => handleMoviePress(item)} />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          scrollEventThrottle={17}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="large" /> : null
          }
        />
      </View>

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
  flexRow: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px',
    marginBottom: '20px'
  }
});
