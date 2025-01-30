import { Pressable, Text, StyleSheet, type PressableProps } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
// import { useColorScheme } from "@/hooks/useColorScheme";

const tintColorLight = "#0a7ea4";

export type ThemedButtonProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
  textLightColor?: string;
  textDarkColor?: string;
  type?: "default" | "outline" | "solid" | "link";
  title: string;
  targetTab?: string; // Añadir esta prop para especificar la pestaña de destino
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  textLightColor,
  textDarkColor,
  type = "default",
  title,
  targetTab, // Añadir targetTab aquí
  ...rest
}: ThemedButtonProps) {
  const navigation = useNavigation(); // Hook de navegación
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const textColor = useThemeColor(
    { light: textLightColor, dark: textDarkColor },
    "text"
  );

  return (
    <Pressable
      style={[
        { backgroundColor },
        type === "default" ? styles.default : undefined,
        type === "outline" ? styles.outline : undefined,
        type === "solid" ? styles.solid : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      onPress={() => {
        if (targetTab) {
          navigation.navigate(targetTab); // Navega a la pestaña especificada
        }
      }}
      {...rest}
    >
      <Text
        style={[
          { color: textColor },
          type === "link" ? styles.linkText : styles.buttonText,
          type === "solid" ? { color: "#fff" } : undefined,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  solid: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: tintColorLight,
    color: "#fff",
  },
  outline: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: tintColorLight,
  },
  link: {
    padding: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    fontSize: 16,
    color: tintColorLight,
    textDecorationLine: "underline",
  },
});
