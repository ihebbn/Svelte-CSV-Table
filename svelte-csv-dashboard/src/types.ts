// types.ts
export interface DataRow {
    [key: string]: string | number;
  }
  
  export interface FilterConfig {
    [column: string]: {
      type: 'contains' | 'exact' | '>' | '<' | 'regex';
      value: string;
    };
  }
  
  export interface SortConfig {
    column: string | null;
    direction: 'asc' | 'desc';
  }
  
  export interface SelectionEvent {
    selected: DataRow[];
    indices: number[];
  }