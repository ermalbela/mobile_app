import Dashboard from '../components/Dashboard';
import Favorites from '../components/Favorites';
import MovieWatcher from '../components/MovieWatcher';
// import AccountSettings from '../screens/AccountSettings';
import FilteredMovies from '../components/FilteredMovies';
// import AdminDashboard from '../screens/AdminDashboard';

export const routes = [
  { name: 'Dashboard', component: Dashboard },
  { name: 'MovieWatcher', component: MovieWatcher },
  { name: 'Favorites', component: Favorites },
//   { name: 'AccountSettings', component: AccountSettings },
  { name: 'FilteredMovies', component: FilteredMovies },
//   { name: 'AdminDashboard', component: AdminDashboard }
];