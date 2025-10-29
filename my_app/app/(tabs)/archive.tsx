import { ThemedView } from "@/components/themed-view";
import { TreeNode, addNode, flattenTree, treeData } from "@/components/tree-row";
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';


export default function RecursiveTaskList() {
  
  //expanded node
  const[isExpanded,setIsExpanded] = useState<string[]>([]);
  //task array, update (usestate method updates everytime something changes -> interactive dynamic changes)  
  const[tasks, setTasks] = useState<TreeNode[]>(treeData);
  //task name
  const[newTaskName,setNewTaskName] = useState<string>('');
  //selected task to add to
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  

  const toggleIsExpanded = (id: string) => {
    // .filter iteriert ueber array und filtert alle eintraege die false sind, wenn also die id expanded ist, dann das betroffene item == id ist
    setIsExpanded(prev => prev.includes(id)? prev.filter(item => item !== id) : [...prev, id]);
  };

  const editTasklist = () => {

    //do nothing
    if (newTaskName.trim() === '') { 
      return;
    };

    //selected a task to add task to
    if(selectedTaskId){
      const updatedTaskList =  addNode(tasks, selectedTaskId, newTaskName);
      setTasks(updatedTaskList);
      
      //expand list after adding, take the prev (current) state and ask if its included
      //IMPORTANT: if u use if(.includes()) and then toggleIsExpanded it can be an old wrong state, thats why u first take the prev and then ask
      setIsExpanded(prevExpandedList => {
        if(prevExpandedList.includes(selectedTaskId)) {
          return prevExpandedList;
        }
        return [...prevExpandedList, selectedTaskId];
      });
    }
    else {
      const updatedTaskList =  addNode(tasks,'', newTaskName);
      setTasks(updatedTaskList);
    }
  
    setNewTaskName('');
    setSelectedTaskId(null);
  };


  const flatData = flattenTree(tasks, 0, isExpanded);
  
  return (
    <TouchableWithoutFeedback onPress={() => {
    }}>
      <ThemedView style = {styles.Container}>
        <FlatList
        data = {flatData}
        keyExtractor = {item => item.id}
        renderItem = {({ item }) => {
          // cant do !!item.children because an empty array would also be true, we dont want to expand an entry with no children FUCK CHILDREN!!
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
        }}
        />
        <TextInput
          style={styles.input}
          placeholder={selectedTaskId ? "Neue Unter-Task..." : "Neue Task..."}
          value={newTaskName}
          onChangeText={setNewTaskName}
        />
        
        <TouchableOpacity style={styles.button} onPress={() => editTasklist()}>
          <Text style={styles.buttonText}>+ Task hinzufügen</Text>
        </TouchableOpacity>
        
      </ThemedView>  
    </TouchableWithoutFeedback>
    );
  }
  

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingHorizontal: 20, 
    paddingBottom: 20,
    backgroundColor: "#1c1c1e", 
  },
  list: {
    flex: 1,
  },
  item: {
    paddingVertical: 12,
    marginVertical: 5,
    backgroundColor: "#3a3a3c",
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
  input: {
    backgroundColor: '#2c2c2e',
    padding: 10,
    borderRadius: 5,
    color: 'white',
    borderWidth: 1,
    borderColor: '#3a3a3c',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



