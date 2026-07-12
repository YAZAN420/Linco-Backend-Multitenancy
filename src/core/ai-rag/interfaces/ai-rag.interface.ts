export interface CreateAiCourseInput {
  course_name: string;
  videos: {
    video_name: string;
    video_url: string;
  }[];
}

export interface AiVideoStatus {
  video_name: string;
  status: string;
}

export interface AiCourseResponse {
  status: string;
  course_name: string;
  videos: AiVideoStatus[];
  message: string;
}

export interface AiStatusResponse {
  course_name: string;
  status: string;
  videos: AiVideoStatus[];
}

export interface AiAnswerResponse {
  answer: string;
}

export interface AiQuizQuestion {
  question: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation: string;
}

export interface AiQuizResponse {
  quiz: AiQuizQuestion[];
}
