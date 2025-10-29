import type { Timestamp } from "firebase/firestore";

export type AppArtifact = {
  id: string;
  name: string;
  description: string;
  downloadUrl: string;
  createdAt: Timestamp;
};
