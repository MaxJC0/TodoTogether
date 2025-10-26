import { ThemedView } from "@/components/themed-view";
import { TreeNode, treeData } from "@/components/tree-row";
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';


export default function RecursiveTaskList() {
  
  const[isExpanded,setIsExpanded] = useState<string[]>([]);

  const toggleIsExpanded = (id: string) => {
    // .filter iteriert ueber array und filtert alle eintraege die false sind, wenn also die id expanded ist, dann das betroffene item == id ist
    setIsExpanded(prev => prev.includes(id)? prev.filter(item => item !== id) : [...prev, id]);
  };

  const flattenTree = (nodes: TreeNode[], level = 0) : (TreeNode & {level: number})[] => {
    //array, jedes element hat treenode und number, ist am anfang leer (=[];)
    let list: (TreeNode & {level: number})[] = [];

    nodes.forEach(node => {
      list.push({...node, level});
      if(!!node.children == true && isExpanded.includes(node.id)) {
        list = [...list, ...flattenTree(node.children, level + 1)];
      };
    });
    return list;
  };
  
  //dummy data
  const flatData = flattenTree(treeData);
  
  return (
    <ThemedView style = {styles.Container}>
      <FlatList
      data = {flatData}
      keyExtractor = {item => item.id}
      renderItem = {({ item }) => {
        // cant do !!item.children because an empty array would also be true, we dont want to expand an entry with no children FUCK CHILDREN!!
        const hasChildren = !!item.children?.length;
        const expanded = isExpanded.includes(item.id);
        
        return (
          <TouchableOpacity style = {[styles.item, {marginHorizontal: 20 * item.level + 10 }]} 
            //onPress = was beim klick passiert und n. sofort returnen, daher () sondern erst beim klicken 
            // fuehre nur toggleisExpanded aus wenn has children true ist
            onPress = {() => hasChildren && toggleIsExpanded(item.id)}>
            <Text>
              {hasChildren? (expanded? "▼ " : "▶ ") : "  " } 
              {item.task}

            </Text>
          </TouchableOpacity>
        );
      }}
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

  },
});



