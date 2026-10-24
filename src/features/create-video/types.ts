export type SourceVideo = {
    uri: string;
    durationSeconds: number;
};
  
export type CreateStep = "select" | "crop" | "details";