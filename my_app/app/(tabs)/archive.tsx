import Tasklist from "@/components/task-list";
import { TreeNode, addNode, flattenTree, toggle, treeData } from "@/components/task-row";
import { ThemedView } from "@/components/themed-view";
import { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';


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
    setIsExpanded(prev => toggle(prev, id))
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

  //flat tree here
  const flatData = flattenTree(tasks, 0, isExpanded);
  
  return (
    <TouchableWithoutFeedback onPress={() => {
      setSelectedTaskId(null);
      Keyboard.dismiss();
    }}>
      <ThemedView style = {styles.Container}>
        <Tasklist
          data={flatData}
          isExpanded={isExpanded}
          selectedTaskId={selectedTaskId}
          toggleIsExpanded={toggleIsExpanded}
          setSelectedTaskId={setSelectedTaskId}
        />  
        <TouchableWithoutFeedback>
          <ThemedView>
            <TextInput
              style={styles.input}
              placeholder={selectedTaskId ? "Neue Teilaufgabe..." : "Neue Aufgabe..."}
              value={newTaskName}
              onChangeText={setNewTaskName}
            />       
            <TouchableOpacity style={styles.button} onPress={() => editTasklist()}>
              <Text style={styles.buttonText}>+ Task hinzufügen</Text>
            </TouchableOpacity>
          </ThemedView>
        </TouchableWithoutFeedback>
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



