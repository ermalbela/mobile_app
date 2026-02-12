import { View, ScrollView, StyleSheet } from 'react-native';
import Loader from './Loader';
import Header from './Header/Header';
import { useContext } from 'react';
import LoadingContext from '../_helper/LoadingContext';
import Footer from './Footer/Footer';

const AppLayout = ({ children }) => {
  const {loading, setLoading} = useContext(LoadingContext);


  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {children}
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2"},
  content: { flexGrow: 1 },
  card: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    margin: 16,
    overflow: "hidden"
  },
});

export default AppLayout;