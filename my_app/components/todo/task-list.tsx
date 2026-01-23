import { TreeNode, } from "@/components/todo/task-row";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


type Props = {
  data: (TreeNode & { level: number })[];
  expanded: string[];
  selectedTaskId: string | null;
  toggleExpanded: (id: string) => void;
  favourites: string[];
  toggleFavourite: (id: string) => void;
  setSelectedTaskId: React.Dispatch<React.SetStateAction<string | null>>;
};


export default function Tasklist({ data, expanded, selectedTaskId, toggleExpanded, favourites, toggleFavourite, setSelectedTaskId }: Props) {

  //define how the input will look,  because we exported it, it doesnt know how data looks now, so we have to describe it
  const renderItem = ({ item }: { item: TreeNode & { level: number } }) => {
    // cant do !!item.children because an empty array would also be true, we dont want to expand an entry with no children, !!FUCKCHILDREN
    const hasChildren = !!item.children?.length;
    const isExpanded = expanded.includes(item.id);
    const isSelected = selectedTaskId === item.id;

    return (
      <TouchableOpacity style={[styles.item, { marginHorizontal: 20 * item.level + 10 }, isSelected && styles.itemSelected]}
        //onPress = was beim klick passiert und n. sofort returnen, daher () sondern erst beim klicken 
        // toggleExpanded only possible if it has children, always marked
        onPress={() => {
          if (hasChildren) toggleExpanded(item.id);
          setSelectedTaskId(item.id);
        }}>
        <View style={styles.rowContent}>
          <Text style={styles.text}>
            {hasChildren ? (isExpanded ? "▼ " : "▶ ") : "  "}
            {item.task}
          </Text>
          <TouchableOpacity
            onPress={() => { toggleFavourite(item.id) }}>
            <Text style={styles.fav_button}>
              {favourites.includes(item.id) ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      style={styles.list}
    />
  );
};


const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  item: {
    paddingVertical: 12,
    marginVertical: 5,
    backgroundColor: '#3a3a3c',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  itemSelected: {
    backgroundColor: '#007AFF',
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  fav_button: {
    color: '#fff',
    fontSize: 25,
  },
});
