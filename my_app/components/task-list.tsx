import { TreeNode,} from "@/components/task-row";
import { FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';


type Props = {
    data: (TreeNode & { level: number })[]; 
    isExpanded: string[];                  
    selectedTaskId: string | null;
    toggleIsExpanded: (id: string) => void;
    setSelectedTaskId: React.Dispatch<React.SetStateAction<string | null>>;
};


export default function Tasklist({data, isExpanded, selectedTaskId, toggleIsExpanded, setSelectedTaskId} : Props) {

    //define how the input will look,  because we exported it, it doesnt know how data looks now, so we have to describe it
    const renderItem = ({ item }: { item: TreeNode & { level: number } }) => {
        // cant do !!item.children because an empty array would also be true, we dont want to expand an entry with no children, !!FUCKCHILDREN
        const hasChildren = !!item.children?.length;
        const expanded = isExpanded.includes(item.id);
        const isSelected = selectedTaskId === item.id;
        
        return (
            <TouchableOpacity style = {[styles.item, {marginHorizontal: 20 * item.level + 10 }, isSelected && styles.itemSelected]} 
                //onPress = was beim klick passiert und n. sofort returnen, daher () sondern erst beim klicken 
                // toggleIsExpanded only possible if it has children, always marked
                onPress = {() => {
                    if (hasChildren) toggleIsExpanded(item.id);
                    setSelectedTaskId(item.id);}}>

                <Text>
                    {hasChildren? (expanded? "▼ " : "▶ ") : "  " } 
                    {item.task}
                </Text>
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
  text: {
    color: '#fff',
    fontSize: 16,
  },
});