

export interface TreeNode {

    id: string;
    task: string;
    children?: TreeNode[];
}


export const treeData: TreeNode[] = [
  {
    id: "1",
    task: "Einkaufsliste",
    children: [
      { id: "1-1", task: "Milch" },
      { id: "1-2", task: "Eier" }
    ]
  },
  {
    id: "2",
    task: "Programmieren",
    children: [
      { id: "2-1", task: "Todo-App bauen" },
      { id: "2-2", task: "API testen" }
    ]
  },
  { id: "3", task: "Sport" }
];

export const toggle = (currentList: string[], id: string): string[] => {
    // .filter iteriert ueber array und filtert alle eintraege die false sind, wenn also die id expanded ist, dann das betroffene item == id ist
    if(currentList.includes(id)){
      return currentList.filter(item => item !== id);
    }
    else{
      return currentList = [...currentList, id];
    }
  };


 export const flattenTree = (nodes: TreeNode[], level = 0, isExpanded: string[]) : (TreeNode & {level: number})[] => {
    // array, each element has treenode and number, is empty in the beginning (=[];) 
    let list: (TreeNode & {level: number})[] = [];

    nodes.forEach(node => {
      list.push({...node, level});
      // check if node.children is not empty, convert it to bool with !!
      if(!!node.children == true && isExpanded.includes(node.id)) {
        list = [...list, ...flattenTree(node.children, level + 1, isExpanded)];
      };
    });
    return list;
  };
  

  export const addNode = (currentNodes: TreeNode[], parentId: string, newTask: string) : TreeNode[] => {
    
    //create new TreeNode object  
    const newNode: TreeNode = {
        id: Date.now().toString(), task: newTask || "Neue Task", children: []
    };

    // if its a root node, means no parent
    if (parentId === '') {
      return [...currentNodes, newNode];
    }

    //if we want to add it as a child to the existing tree
    //copy and edit the current tree
    return currentNodes.map(node => {

      if(node.id === parentId) {
        return {
          //return the node, but change the children property (overwrite it) with children:
          ...node, children: [... (node. children || []), newNode]
        };
      };
      if(!!node.children == true){
        return{
          //look recursive through the whole tree
          ...node, children: addNode(node.children, parentId, newTask)
        };
      };
      // if its not the node we want to add something to, return and go to the next one
      return node;
    });
  };

