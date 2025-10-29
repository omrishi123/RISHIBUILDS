import type { Timestamp } from "firebase/firestore";

export type AppArtifact = {
  id: string;
  name: string;
  description: string;
  downloadURL: string;
  storagePath: string;
  createdAt: Timestamp;
};
