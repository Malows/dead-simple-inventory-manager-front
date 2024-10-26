export interface Model {
  id: number;
  uuid: string;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface RawModel {
  id: number;
  uuid: string;
  created_at: string | null;
  updated_at: string | null;
}
