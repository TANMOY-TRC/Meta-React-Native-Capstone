import { View, Text, StyleSheet, Pressable } from "react-native";

import { toWordCase } from "../utils/stringHelpers";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../constants/colors";

export function Filters({ onChange, selections, sections }) {
  const { theme } = useTheme();

  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <Pressable
          key={index}
          onPress={() => onChange(index)}
          style={[styles.filter, { backgroundColor: selections[index] ? theme.colors.primary : theme.colors.muted }]}
        >
          <View>
            <Text style={[styles.filterText, { color: selections[index] ? colors.White : theme.colors.placeholder }]}>
              {toWordCase(section)}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  filter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontFamily: "Karla-Bold",
    includeFontPadding: false,
  },
});
