import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

import Loader from "../Layout/Loader";
import AuthContext from "../_helper/AuthContext";
import {
  deleteComment,
  deleteMovie,
  getComments,
  getFavorites,
  getLimitedComments,
  selectMovie,
  toggleFavoriteApi,
} from "../Endpoint";
import LoadingContext from "../_helper/LoadingContext";
import { Button } from "react-native-web";
import FractionalStar from "./CommonElements/FractionalStar";
import CommonModal from "./CommonElements/CommonModal";
import CommentForm from "./Forms/CommentForm";
import RateForm from "./Forms/RateForm";

const MovieWatcher = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id: id } = route.params;
  const { role } = useContext(AuthContext);

  const [movie, setMovie] = useState({});
  const [comments, setComments] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [deleteMovieModalVisible, setDeleteMovieModalVisible] = useState(false);
  const [addComment, setAddComment] = useState(false);
  const [addRate, setAddRate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;
  const [totalComments, setTotalComments] = useState(0);

  // ========================= FETCH MOVIE =========================
  const getMovie = async () => {
    setLoading(true);
    try {
      const response = await axios.get(selectMovie, {
        params: {id},
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMovie(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ========================= COMMENTS =========================
  const fetchComments = async () => {
    const response = await axios.get(getComments + id, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setComments(response.data);
  };

  const fetchLimitedComments = async () => {
    const response = await axios.get(getLimitedComments + id, {
      params: {
        Page: currentPage,
        PageSize: commentsPerPage
      }, headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setComments(prev => [...prev, ...response.data.limited_comments,]);
    setTotalComments(response.data.totalCount);
  }
  // ========================= FAVORITES =========================
  const fetchFavorites = async () => {
    const response = await axios.get(
      getFavorites + JSON.parse(localStorage.getItem("userId")),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    setIsFavorite(response.data.some((fav) => fav.movieId === id));
  };

  const toggleFavorite = async () => {
    await axios
      .post(
        toggleFavoriteApi,
        {
          MovieId: id,
          UserId: JSON.parse(localStorage.getItem("userId")),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setIsFavorite(
          res.data.some((fav) => fav.movieId === id) ? true : false,
        )
      });
  };

  // ========================= DELETE COMMENT =========================
  const handleDeleteComment = (commentId) => {
    setSelectedCommentId(commentId);
    setModalVisible(true);
  };

  const confirmDeleteComment = async () => {
    if (!selectedCommentId) return;

    try {
      await axios.delete(deleteComment + selectedCommentId, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          UserId: JSON.parse(localStorage.getItem("userId")),
          Role: role
        },
        withCredentials: true
      })
      .then(res => console.log(res.data))
      fetchComments();
    } catch (err) {
      console.log(err.response);
    } finally {
      setModalVisible(false);
      setSelectedCommentId(null);
      window.alert('Success, Rating added.');
    }
  };


  const handleDeleteMovie = () => {
    setDeleteMovieModalVisible(true);  
  }
  
  // ========================= DELETE MOVIE =========================
  const confirmDeleteMovie = async () => {
    try {
      await axios.delete(deleteMovie + movie.id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigation.goBack();
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteMovieModalVisible(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
    // fetchComments();
    setComments([]);
    setCurrentPage(1);
    getMovie();
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchLimitedComments();
  }, [currentPage])

  const videoSource = movie.video;

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });


  return (loading || !movie?.video) ? (
    <Loader />
  ) : (
    <ScrollView style={styles.container}>
      <View style={styles.flexRow}>
        {role === "Superadmin" ? (
          <View style={styles.actions}>
            <Text style={styles.title}>Movie Watcher</Text>
            <TouchableOpacity
              style={[styles.button, styles.delete]}
              onPress={handleDeleteMovie}
            >
              <Text style={{ color: "#fff" }}>Delete Movie</Text>
            </TouchableOpacity>
          </View>
        ) : <Text style={styles.title}>Movie Watcher</Text>}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={() => setAddRate(true)}>
            <Text style={styles.text}>Rate Movie</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => setAddComment(true)}>
            <Text style={styles.text}>Add Comment</Text>
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{movie.title}</Text>

          <TouchableOpacity onPress={toggleFavorite}>
            <Icon 
              name="star" 
              size={26} 
              color={"#f5c518"} 
              solid={isFavorite} 
            />
          </TouchableOpacity>
        </View>

        {player &&
          <VideoView
            player={player}
            style={styles.video}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls
          />
        }
        
        <Text style={styles.plot}>{movie.plot}</Text>
          <View style={styles.ratingContainer}>
            <View style={styles.ratingBlock}>
              <Text style={styles.label}>Rating:</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => {
                  let fillPercent = 0;

                  if (star <= Math.floor(movie.averageRating)) {
                    fillPercent = 100;
                  } else if (star === Math.ceil(movie.averageRating)) {
                    fillPercent = (movie.averageRating % 1) * 100;
                  }
                  return <FractionalStar key={star} fillPercent={fillPercent} />;
                })}
              </View>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.infoText}>
                Rating Count: <Text style={styles.infoValue}>{movie.ratingCount}</Text>
              </Text>
              <Text style={styles.infoText}>
                Actors: <Text style={styles.infoValue}>{movie?.actors?.join(", ")}</Text>
              </Text>
              <Text style={styles.infoText}>
                Directors: <Text style={styles.infoValue}>{movie?.directors?.join(", ")}</Text>
              </Text>
            </View>
          </View>

        {movie?.poster ? 
          (
            <Image
              source={{ uri: movie.poster }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : null}
      </View>

      <View style={{height: '30vh'}}>
        <Text style={styles.section}>Comments</Text>

        {comments.length === 0 ? (
          <Text style={styles.empty}>No comments yet…</Text>
        ) : (
          comments.map((comment) => {
            return (
            <View key={comment.id} style={styles.comment}>
              <View style={styles.commentHeader}>
                <Text style={styles.username}>{comment.userName}</Text>
                {(comment.userId === JSON.parse(localStorage.getItem("userId")) ||
                  role === "Superadmin") && (
                  <TouchableOpacity
                    onPress={() => handleDeleteComment(comment.id)}
                  >
                    <Icon name="times" size={18} color="darkred" />
                  </TouchableOpacity>
                )}
              </View>
              <Text>{comment.content}</Text>
              <Text style={styles.timestamp}>
                {new Date(comment.createdAt).toLocaleString()}
              </Text>
            </View>
          )})
        )}
        {comments.length < totalComments ? (
          <View style={styles.loadButtonsContainer}>
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={() => setCurrentPage(currentPage + 1)}
            >
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loadAllButton}
              onPress={() => fetchComments()}
            >
              <Text style={styles.loadMoreText}>Load All</Text>
            </TouchableOpacity>
          </View>
        ) : <Text style={{color: 'gray', textAlign: "center"}}>You reached the end.</Text>}
      </View>

      <CommonModal
        visible={modalVisible}
        message="Delete this comment?"
        btnTitle={"Delete"}
        color={"red"}
        onConfirm={confirmDeleteComment}
        onCancel={() => setModalVisible(false)}
        defaultButtons={true}
      />

      <CommonModal
        visible={deleteMovieModalVisible}
        message="Delete this movie?"
        onConfirm={confirmDeleteMovie}
        color={"red"}
        btnTitle={"Delete"}
        defaultButtons={true}
        onCancel={() => setDeleteMovieModalVisible(false)}
      />

      <CommonModal
        visible={addComment}
        message="Add Comment"
        color={"#24695c"}
        btnTitle={"Add Comment"}
        onCancel={() => setAddComment(false)}
        defaultButtons={false}
        FormComponent={CommentForm}
        formProps={{movieId: id, setAddComment, fetchComments}}
      />

      <CommonModal
        visible={addRate}
        message="Rate Movie!"
        color={"#24695c"}
        btnTitle={"Rate Movie"}
        onCancel={() => setAddRate(false)}
        defaultButtons={false}
        FormComponent={RateForm}
        formProps={{movieId: id, setAddRate, getMovie}}
      />
    </ScrollView>
  );
};

export default MovieWatcher;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  flexRow: {
    justifyContent: 'space-between',
    display: 'flex',
    margin: '10px',
    marginBottom: '20px'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 12,
  },
  button: {
    backgroundColor: "#24695c",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "370"
  },
  delete: {
    backgroundColor: "#c0392b",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  video: {
    width: "100%",
    height: 220,
    backgroundColor: "#000",
    borderRadius: 8,
    marginVertical: 10,
  },
  plot: {
    fontSize: 15,
    color: "#333",
    marginBottom: 20,
    lineHeight: 20,
    marginTop: 20
  },
  poster: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginVertical: 20,
    fontSize: 15,
  },
  comment: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  loadButtonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: "row"
  },
  loadMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignSelf: "center",
    marginVertical: 10,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadAllButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#24695c",
    borderRadius: 8,
    alignSelf: "center",
    marginVertical: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
  },
  ratingBlock: {
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  stars: {
    flexDirection: "row",
  },
  infoBlock: {
    flexDirection: "column",
  },
  infoText: {
    marginBottom: 5,
    fontSize: 14,
    color: "#333",
  },
  infoValue: {
    fontWeight: "600",
  },
  ratingContainer: {
    marginBottom: 20
  }
});
