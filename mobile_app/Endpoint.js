const userApi = 'http://localhost:5064/api/users/';
export const registerUser = userApi + 'register';
export const loginUser = userApi + 'login';
export const getRole = userApi + 'user-role';
export const logout = userApi + 'logout';
export const getFavorites = userApi + 'favorites/';
export const toggleFavoriteApi = userApi + 'toggle_favorite';
export const getAllFavorites = userApi + 'get_all_favorites/';

const movieApi = 'http://localhost:5064/api/movies/';
export const getMovies = movieApi + 'get_movies';
export const getLimitedMovies = movieApi + 'get_limited';
export const selectMovie = movieApi + 'get_movie';
export const addMovie = movieApi + 'create_movie';
export const getFilteredMovies = movieApi + 'filter_movies?';
export const rateMovie = movieApi + 'rate_movie/';
export const deleteMovie = movieApi + 'delete_movie/';

const commentApi = 'http://localhost:5064/api/comments/';
export const addComment = commentApi + 'add_comment';
export const getComments = commentApi + 'get_comments/';
export const deleteComment = commentApi + 'delete_comment/';

const profileApi = 'http://localhost:5064/api/profile/';
export const getProfile = profileApi;
export const updateProfile = profileApi;