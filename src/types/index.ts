import type { Timestamp } from "firebase/firestore";

export type AppArtifact = {
  id: string;
  name: string;
  description: string;
  gdriveFileId: string;
  createdAt: Timestamp;
};
