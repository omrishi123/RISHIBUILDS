import type { Timestamp } from "firebase/firestore";

export type App = {
  id: string;
  name: string;
  description: string;
  downloadURL: string;
  storagePath: string;
  createdAt: Timestamp;
};
