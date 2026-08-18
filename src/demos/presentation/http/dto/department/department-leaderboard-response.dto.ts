import { JobTitle } from 'src/generated/prisma/client';

export class DepartmentLeaderboardResponseDto {
  rank!: number;
  userId!: string;
  departmentMemberId!: string;
  firstName!: string;
  lastName!: string;
  imagePath!: string;
  jobTitle!: JobTitle;
  totalScore!: number;
}
