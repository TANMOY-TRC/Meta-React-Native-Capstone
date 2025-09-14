import { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import debounce from "lodash.debounce";

import { Hero } from "../components/Hero";
import { Filters } from "../components/Filters";
import { Separator } from "../components/Separator";
import { MenuItems } from "../components/MenuItems";
import { fetchData } from "../network/network";
import { createTable, filterByQueryAndCategories, getMenuItems, saveMenuItems } from "../storage/database/database";
import { useUpdateEffect } from "../hooks/useUpdateEffect";
import { CustomAlert } from "../components/CustomAlert";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../constants/colors";

export default function Home() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const sections = ["starters", "mains", "desserts", "drinks"];

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(sections.map(() => false));

  const lookup = useCallback((query) => {
    setQuery(query);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (searchText) => {
    setSearchText(searchText);
    debouncedLookup(searchText);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  useEffect(() => {
    debouncedLookup(searchText);
    return () => {
      debouncedLookup.cancel();
    };
  }, [searchText]);

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();

        // The application only fetches the menu data once from a remote URL
        // and then stores it into a SQLite database.
        // After that, every application restart loads the menu from the database
        if (!menuItems.length) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems);
        }

        setData(menuItems);
      } catch (error) {
        CustomAlert("Network Issue", "Menu items could not be retrived.");
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((category, idx) => {
        if (filterSelections.every(item => item === false)) {
          return true;
        }
        return filterSelections[idx];
      });

      try {
        const menuItems = await filterByQueryAndCategories(query, activeCategories);
        setData(menuItems);
      } catch (error) {
        CustomAlert("Error", "An issue occurred while applying filters or performing the search.");
      }
    })();
  }, [filterSelections, query]);

  return (
    <SafeAreaView style={styles.main} edges={["left", "right", "bottom"]}>
      <View style={styles.mainContainer}>
        {/* Hero */}
        <Hero searchText={searchText} handleSearchChange={handleSearchChange} />

        {/* Menu Container */}
        <View style={styles.menuContainer}>
          <Text style={styles.title}>
            ORDER FOR DELIVERY!
          </Text>

          {/* Filters */}
          <View style={styles.filterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <Filters
                selections={filterSelections}
                onChange={handleFiltersChange}
                sections={sections}
              />
            </ScrollView>
          </View>

          {/* Menu List */}
          <View style={{ flex: 1 }}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id?.toString() || item.name}
              renderItem={({ item }) => (
                <>
                  <Separator />
                  <MenuItems item={item} />
                </>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No menu items available</Text>
                </View>
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mainContainer: {
    flex: 1,
  },
  filterContainer: {
    marginTop: 6,
    marginBottom: 12,
  },
  menuContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontFamily: "Karla-Bold",
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 4,
    color: theme.colors.text,
    includeFontPadding: false,
  },
  spacer: {
    height: 10,
  },
  emptyContainer: {
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Karla-SemiBold",
    fontSize: 14,
    color: colors.Muted,
  },
});
