import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol"; // Importa tu componente de ícono
import { useThemeColor } from "@/hooks/useThemeColor"; // Hook para obtener los colores del tema

interface ThemedSearchbarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onSubmitEditing?: (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void; // Añadir el prop
}

export function ThemedSearchbar({
  value,
  onChangeText,
  placeholder,
  onSubmitEditing, // Añadirlo aquí también
}: ThemedSearchbarProps) {
  const backgroundColor = useThemeColor(
    { light: "#f0f0f0", dark: "#444" },
    "background"
  );
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const placeholderColor = useThemeColor(
    { light: "#888", dark: "#bbb" },
    "placeholder"
  );
  const iconColor = useThemeColor({ light: "#888", dark: "#bbb" }, "text"); // Color del ícono

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <IconSymbol
        name="search" // El ícono de lupa
        size={20}
        color={iconColor}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, { color: textColor }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={onSubmitEditing} // Añadir onSubmitEditing aquí
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 8,
    height: 43,
    marginBottom: 10,
  },
  icon: {
    marginRight: 8, // Espacio entre el ícono y el campo de texto
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 7,
  },
});
