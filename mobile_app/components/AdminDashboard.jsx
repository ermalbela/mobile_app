import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import CommonModal from "./CommonElements/CommonModal";
import axios from "axios";
import AuthContext from "../_helper/AuthContext";

const AdminDashboard = () => {
  const [deleteUserVisible, setDeleteUserVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { role } = useContext(AuthContext);
  const API_BASE = "http://localhost:5064/api/admin_dashboard";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = async (id, username) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.alert(`User has been removed.`);
      fetchUsers();
      setDeleteUserVisible(false);
    } catch (err) {
      window.alert("Error, Failed to delete user.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Determine if delete button should be shown
  const canDelete = (targetRole) => {
    if (targetRole === "Superadmin") return false; // cannot delete Superadmin
    if (role === "Superadmin") return true; // can delete Admins & Users
    if (role === "Admin" && targetRole === "User") return true; // Admin only deletes Users
    return false;
  };

  const renderUser = ({ item, index }) => (
    <View style={styles.userCard}>
      <View style={styles.userRow}>
        <Text style={styles.userIndex}>{index + 1}.</Text>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.userDetail}>Email: {item.email}</Text>
          <Text style={styles.userDetail}>Role: {item.role}</Text>
          <Text style={styles.userDetail}>Status: {item.status}</Text>
          <Text style={styles.userDetail}>
            Last Login: {item.lastLogin ? new Date(item.lastLogin).toLocaleString() : "Never"}
          </Text>
        </View>
        <View style={styles.actions}>
          {canDelete(item.role) ? (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                setDeleteUserVisible(true)
                setSelectedUser(item?.id)
                console.log(item);
              }}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noAccess}>No Access</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#24695c" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : users.length === 0 ? (
          <Text style={styles.empty}>No users found.</Text>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}
            contentContainerStyle={{ paddingBottom: 50 }}
          />
        )}
      {selectedUser ? 
        <CommonModal
          visible={deleteUserVisible}
          message="Delete this user?"
          onConfirm={() => confirmDeleteUser(selectedUser)}
          color={"red"}
          btnTitle={"Delete"}
          defaultButtons={true}
          onCancel={() => setDeleteUserVisible(false)}
        />
      : ''}
    </ScrollView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  userCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 10
  },
  userRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userIndex: {
    fontWeight: "bold",
    marginRight: 8,
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userDetail: {
    fontSize: 14,
    color: "#333",
  },
  actions: {
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#d33",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noAccess: {
    color: "#999",
    fontStyle: "italic",
    marginTop: 6,
  },
});