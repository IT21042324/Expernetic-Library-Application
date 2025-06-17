import { DatePicker, Input, InputNumber } from "rsuite";

export type Book = {
  id: number;
  title: string;
  author: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  status?: "EDIT" | "VIEW" | null;
};

export type BookPost = Omit<Book, "id" | "createdAt" | "updatedAt">;

export type BookPostMassEdit = Omit<Book, "createdAt" | "updatedAt">;

export type BookField =
  | "id"
  | "title"
  | "author"
  | "description"
  | "createdAt"
  | "updatedAt";

export type BookFieldType = string | number | Date | undefined;

const fieldMap = {
  string: Input,
  number: InputNumber,
  date: DatePicker,
};

export type EditableCellProps = {
  rowData?: Book;
  dataType: keyof typeof fieldMap;
  dataKey: BookField;
  onChange?: (id: number, key: BookField, value: BookFieldType) => void;
  onEdit?: (id: number) => void;
};

export type ActionCellProps = {
  rowData?: Book;
  dataKey: BookField;
  onEdit: (id: number) => void;
  onRemove: (id: number) => void;
  style?: React.CSSProperties;
  bookDataFromLocalState: BookContextType[];
  setBookDataFromLocalState: React.Dispatch<React.SetStateAction<Book[]>>;
};

export type BookContextType = {
  id: number;
  title?: string;
  author?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: "EDIT" | "VIEW" | null;
};

export type BookState = {
  books: BookContextType[];
};

// type ActionState = {
//   type: string;
//   payload: Book | Book[];
// };

export type BookContextProviderProps = {
  children: React.ReactNode;
};

export type ActionState =
  | { type: "AddBook"; payload: BookContextType }
  | { type: "LoadBooks"; payload: BookContextType[] }
  | { type: "DeleteBook"; payload: BookContextType }
  | { type: "EditBook"; payload: BookContextType };
