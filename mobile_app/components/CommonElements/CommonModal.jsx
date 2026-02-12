import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import Modal from "react-native-modal";

const CommonModal = ({
  visible,
  onConfirm,
  onCancel,
  btnTitle,
  message,
  color,
  FormComponent,
  formProps,
  defaultButtons
}) => {
  return (
    <Modal isVisible={visible} backdropOpacity={0.4} transparent>
      <View style={styles.modal}>
        <Text style={styles.msgtext}>{message}</Text>
        {FormComponent && (
          <View style={styles.modalBody}>
            <FormComponent {...formProps} />
          </View>
        )}

        {defaultButtons && <View style={styles.buttons}>
          <Pressable onPress={onCancel} style={[styles.button, {backgroundColor: "grey"}]}>
            <Text style={styles.text}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            style={[styles.button, {backgroundColor: color}]}
          >
            <Text style={styles.text}>{btnTitle}</Text>
          </Pressable>
        </View>
        }
      </View>
    </Modal>
  );
};

export default CommonModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalBody: {
    width: "100%",
    height: "auto",
  },
  text: {
    fontSize: 16,
    color:'#fff'
  },
  msgtext: {
    fontSize: 20,
    marginBottom: 20
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
});
