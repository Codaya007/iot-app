import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor"; // Para manejar colores del tema

interface UnorderedListProps {
  data: string[]; // Lista de elementos de texto
}

export function UnorderedList({ data }: UnorderedListProps) {
  const bulletColor = useThemeColor({ light: "#000", dark: "#fff" }, "text"); // Color del bullet según el tema

  return data.map((item, i) => {
    return (
      <View key={i} style={styles.listItem}>
        <Text style={[styles.bullet, { color: bulletColor }]}>•</Text>
        <Text style={styles.text}>{item}</Text>
      </View>
    );
  });
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bullet: {
    marginRight: 10, // Espacio entre el bullet y el texto
    fontSize: 20, // Tamaño del bullet
  },
  text: {
    fontSize: 16,
    color: "#333", // Color del texto
  },
});
