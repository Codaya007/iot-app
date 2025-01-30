import React from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor"; // Hook para obtener colores del tema
import { tintColorLight } from "@/constants/Colors";

export function ThemedLoader() {
  // Obtenemos el color del tema para el spinner
  const spinnerColor = useThemeColor(
    { light: tintColorLight, dark: "#fff" },
    "text"
  );

  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={spinnerColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
