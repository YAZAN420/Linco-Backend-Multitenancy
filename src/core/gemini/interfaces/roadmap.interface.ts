export interface RoadmapStep {
  week: number;
  topic: string;
  skills: string[];
}

export interface RoadmapResponse {
  title: string;
  description: string;
  duration: string;
  steps: RoadmapStep[];
}
