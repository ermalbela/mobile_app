import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ListOfMenu = ({ searchResult, setSearchValue, setSearchToggle, style }) => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        setSearchValue('');
        setSearchToggle(false);
        navigation.navigate('MovieDetails', { movieId: item.id });
      }}
    >
      <Image source={{ uri: item.poster }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.genres}>[{item.genres.join(', ')}]</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={searchResult}
      keyExtractor={(item, idx) => idx.toString()}
      renderItem={renderItem}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <Text style={styles.emptyText}>No results found</Text>
      }
      style={[styles.listContainer, style]}
    />
  );
};

export default ListOfMenu;

const styles = StyleSheet.create({
  listContainer: {
    position: 'absolute',  // float over header
    top: 45,               // below the input
    left: 0,
    right: 0,
    maxHeight: 200,        // limit height
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    zIndex: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 70,
    marginRight: 10,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  genres: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
  },
  searchDropdown: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    zIndex: 20,
  }

});
