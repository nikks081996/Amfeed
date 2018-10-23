import React from "react";
import { Text, View } from "react-native";

const HeaderComponent = props => {
  const { textStyle, viewStyle } = styles;
  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{props.headerText} </Text>
    </View>
  );
};

const styles = {
  viewStyle: {
    backgroundColor: "#512DA8",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    marginTop: 24
  },
  textStyle: {
    fontSize: 20,
    color: "#ffffff"
  }
};

export { HeaderComponent };
