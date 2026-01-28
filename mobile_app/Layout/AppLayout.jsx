import { View, ScrollView, StyleSheet } from 'react-native';
import Loader from './Loader';
import Header from './Header/Header';
import { useContext } from 'react';
import LoadingContext from '../_helper/LoadingContext';

const AppLayout = ({ children }) => {
  const {loading, setLoading} = useContext(LoadingContext);


  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, padding: 16 }
});

export default AppLayout;