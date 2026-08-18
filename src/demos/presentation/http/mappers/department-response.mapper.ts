import { Injectable } from '@nestjs/common';
import { DepartmentResponseDto } from '../dto/department/department-response.dto';
import {
  DepartmentLeaderboardItem,
  DepartmentWithDetails,
} from 'src/core/database/prisma/types';
import { DepartmentLeaderboardResponseDto } from '../dto/department/department-leaderboard-response.dto';

@Injectable()
export class DepartmentResponseMapper {
  toResponseFromPrisma(
    department: DepartmentWithDetails,
  ): DepartmentResponseDto {
    return new DepartmentResponseDto(
      department.id,
      department.name,
      department.managerId,
      department.description,
      department.isGroup,
      department.createdAt,
      department.updatedAt,
      department._count.courses,
      department._count.members,
      department.isJoined,
    );
  }

  toResponseManyFromPrisma(
    departments: DepartmentWithDetails[],
  ): DepartmentResponseDto[] {
    return departments.map((dept) => this.toResponseFromPrisma(dept));
  }

  toLeaderboardResponse(
    item: DepartmentLeaderboardItem,
  ): DepartmentLeaderboardResponseDto {
    return {
      rank: Number(item.rank),
      userId: item.userId,
      departmentMemberId: item.memberId,
      firstName: item.firstName,
      lastName: item.lastName,
      imagePath: item.imagePath,
      jobTitle: item.jobTitle,
      totalScore: Number(item.totalScore),
    };
  }

  toLeaderboardResponseMany(
    items: DepartmentLeaderboardItem[],
  ): DepartmentLeaderboardResponseDto[] {
    return items.map((item) => this.toLeaderboardResponse(item));
  }
}
