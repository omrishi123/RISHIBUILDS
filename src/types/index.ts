
import type { Timestamp } from "firebase/firestore";

export type AppArtifact = {
  id: string;
  name: string;
  description: string;
  downloadUrl: string;
  createdAt: Timestamp;
  logoBase64?: string;
  version: string;
};

export type Website = {
    id: string;
    name: string;
    url: string;
    description: string;
}
