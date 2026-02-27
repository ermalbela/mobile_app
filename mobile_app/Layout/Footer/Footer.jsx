import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image
} from 'react-native';
import AuthContext from '../../_helper/AuthContext';
import { MENUITEMS } from '../../Menu';
import { useNavigation } from '@react-navigation/native';


const Footer = () => {
  const { role } = useContext(AuthContext);
  const [activePath, setActivePath] = useState(null);

  const navigation = useNavigation();

  const handleNavigation = (path) => {
    console.log(path);
    setActivePath(path);
    navigation.navigate(path);
  };

  return (
    <View style={styles.footerContainer}>
      {/* Menu Items */}
      <View style={styles.menuWrapper}>
        {MENUITEMS.map(item =>
          item.Items.map((menuItem, idx) => {

            if (
              menuItem.title === 'Admin' &&
              role !== 'Superadmin' &&
              role !== 'Admin'
            ) {
              return null;
            }

            if (menuItem.type === 'link') {
              return (
                <Pressable
                  key={idx}
                  style={[
                    styles.menuItem,
                    activePath === menuItem.path && styles.activeItem
                  ]}
                  onPress={() => handleNavigation(menuItem.path)}
                >
                  {menuItem.icon && 
                    menuItem.icon({
                      size: 22,
                      color: activePath === menuItem.path && "#24695c"
                    })}
                  <Text style={styles.menuText}>
                    {menuItem.title}
                  </Text>
                </Pressable>
              );
            }

            return null;
          })
        )}
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    maxHeight: "85px",
    maxWidth: "100%",
    overflow: 'hidden'
  },
  menuWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  menuItem: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  menuText: {
    color: '#000',
    fontSize: 14,
    marginLeft: "4px"
  },
  activeItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#24695c'
  }
});
