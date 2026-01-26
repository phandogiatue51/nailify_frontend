import { Collection } from "./database";
export interface TagDto {
  id: string;
  name: string;
  category: number; // 0, 1, 2, etc.
  color?: string;
  icon?: string;
}

export interface CollectionWithTagsDto extends Collection {
  tags: TagDto[];
}
