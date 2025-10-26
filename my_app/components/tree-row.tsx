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
