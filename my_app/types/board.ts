export interface BoardMember {
  id: string;
  name: string;
}

export interface Board {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  members: BoardMember[];
  color: string;
  notificatoins: boolean;
}
