import { request } from "./client";
import { Board } from "@/types";

export const boardsApi = {
  getBoards: () => request<Board[]>("/boards"),

  createBoard: (data: { name: string; color: string }) =>
    request<Board>("/boards", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateBoard: (id: string, data: Partial<Board>) =>
    request<Board>(`/boards/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  deleteBoard: (id: string) =>
    request<void>(`/boards/${id}`, {
      method: "DELETE"
    })
};

