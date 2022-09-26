import { Position } from "./position";

export interface Attachment {
  x: number;
  y: number;
  scaling: Position;
  rotatation: number;
  base64: string;
}
