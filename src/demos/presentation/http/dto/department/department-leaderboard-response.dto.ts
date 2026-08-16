import { JobTitle } from 'src/generated/prisma/client';

export class DepartmentLeaderboardResponseDto {
  rank!: number;
  demoMemberId!: string;
  firstName!: string;
  lastName!: string;
  imagePath!: string;
  jobTitle!: JobTitle;
  totalScore!: number;
}
