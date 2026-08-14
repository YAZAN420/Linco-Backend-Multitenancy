import { CourseVisibility } from 'src/generated/prisma/client';

export interface CourseDashboardItemStats {
  sectionsCount: number;
  lessonsCount: number;
  totalDuration: number;
  learnersCount: number;
  certificationsCount: number;
}

export interface CourseDashboardOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CourseDashboardDemo {
  id: string;
  name: string;
  imagePath: string;
  owner: CourseDashboardOwner;
}

export interface CourseDashboardTag {
  id: string;
  name: string;
}

export interface CourseDashboardItem {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  signatureImagePath: string;
  visibility: CourseVisibility;
  price: number;
  isPublished: boolean;
  demoId: string;
  createdAt: Date;
  updatedAt: Date;
  demo: CourseDashboardDemo;
  tags: CourseDashboardTag[];
  stats: CourseDashboardItemStats;
}
