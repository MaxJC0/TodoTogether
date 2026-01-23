import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";
import { FlatList, StyleSheet, Text, View } from 'react-native';



export default function DummyList() {

  const testTasks = [
    { id: "1", name: 'Alice Anderson', username: 'a_anderson' },
    { id: "2", name: 'Bob Berger', username: 'b_berger' },
    { id: "3", name: 'Charlie Chaplin', username: 'charlie' },
    { id: "4", name: 'David Dinkel', username: 'dave' },
    { id: "5", name: 'Eva Erlich', username: 'eva_e' },
    { id: "6", name: 'Frank Fuchs', username: 'franky' },
    { id: "7", name: 'Greta Gerwig', username: 'greta' },
    { id: "8", name: 'Hans Haas', username: 'h_haas' },
    { id: "9", name: 'Ida Igel', username: 'ida' },
    { id: "10", name: 'Alice Anderson', username: 'a_anderson' },
    { id: "11", name: 'Bob Berger', username: 'b_berger' },
    { id: "12", name: 'Charlie Chaplin', username: 'charlie' },
    { id: "13", name: 'David Dinkel', username: 'dave' },
    { id: "14", name: 'Eva Erlich', username: 'eva_e' },
    { id: "15", name: 'Frank Fuchs', username: 'franky' },
    { id: "16", name: 'Greta Gerwig', username: 'greta' },
    { id: "17", name: 'Hans Haas', username: 'h_haas' },
    { id: "18", name: 'Ida Igel', username: 'ida' },
  ];

  // jedes flatlist element hat item eigenschaft, item wird zum rendern übergeben (für jedes element) 
  // style = {styles.item} = style für jedes item = entry, ist von unten; item.name ist aus dem oberen array, nicht verwechseln!
  /// flatlist item braucht 
  // 1. data 
  // 2 . key(extractor) 
  // 3. renderItem
  return (
    <ThemedView style={styles.Container}>
      <ThemedText type="title">archive</ThemedText>
      <FlatList
        data={testTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  item: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#6e646478",
    borderRadius: 8,
    width: "100%",

  },
});



