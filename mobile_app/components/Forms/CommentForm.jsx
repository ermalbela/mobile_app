import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import axios from "axios";
import { addComment } from "../../Endpoint";

const CommentForm = ({ movieId, setAddComment, fetchComments }) => {
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});

  const validate = (value) => {
    const errs = {};
    if (!value || value.length < 3) {
      errs.comment = "Enter a valid comment (min 3 chars)";
    }
    return errs;
  };

  const handleSubmit = async () => {
    const validationErrors = validate(comment);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const userId = JSON.parse(localStorage.getItem("userId"));
    const userName = JSON.parse(localStorage.getItem("name"));

    try {
      await axios.post(
        addComment,
        {
          Content: comment,
          UserId: userId,
          MovieId: movieId,
          CreatedAt: new Date().toISOString(),
          UserName: userName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      setComment("");
      setAddComment(false);
      fetchComments();
      window.alert('Success, Rating added.');

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What do you think about this movie?</Text>

      <TextInput
        style={[
          styles.input,
          errors.comment && styles.inputError,
        ]}
        placeholder="e.g. Mr. Bean"
        multiline
        value={comment}
        onChangeText={setComment}
      />

      {errors.comment && (
        <Text style={styles.errorText}>{errors.comment}</Text>
      )}

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() => setAddComment(false)}
        >
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.primary]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Add Comment</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CommentForm;


const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  primary: {
    backgroundColor: "#24695c",
  },
  secondary: {
    backgroundColor: "#7f8c8d",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
