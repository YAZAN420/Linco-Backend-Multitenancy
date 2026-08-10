import { NotFoundException } from '@nestjs/common';
import { CertificationsQueryService } from './certifications-query.service';
import { CertificationQueryRepository } from './ports/certification-query.repository';

describe('CertificationsQueryService', () => {
  let repository: {
    findAllCursor: jest.Mock;
    findById: jest.Mock;
    findByCourseAndMember: jest.Mock;
  };
  let service: CertificationsQueryService;

  beforeEach(() => {
    repository = {
      findAllCursor: jest.fn(),
      findById: jest.fn(),
      findByCourseAndMember: jest.fn(),
    };
    service = new CertificationsQueryService(
      repository as unknown as CertificationQueryRepository,
    );
  });

  it('scopes my-certifications pagination to the active demo member', async () => {
    const page = { data: [], meta: { hasNextPage: false, endCursor: null } };
    repository.findAllCursor.mockResolvedValue(page);

    const result = await service.findMineCursor('member-id', {
      take: 15,
      cursor: 'cursor-id',
    });

    expect(repository.findAllCursor).toHaveBeenCalledWith({
      take: 15,
      cursor: 'cursor-id',
      demoMemberId: 'member-id',
    });
    expect(result).toBe(page);
  });

  it('finds my certification using both course and member IDs', async () => {
    const certification = { id: 'certification-id' };
    repository.findByCourseAndMember.mockResolvedValue(certification);

    const result = await service.findMineByCourse('member-id', 'course-id');

    expect(repository.findByCourseAndMember).toHaveBeenCalledWith(
      'course-id',
      'member-id',
    );
    expect(result).toBe(certification);
  });

  it('returns not found when the active member has no course certification', async () => {
    repository.findByCourseAndMember.mockResolvedValue(null);

    await expect(
      service.findMineByCourse('member-id', 'course-id'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
