import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PrismaExamAttemptMapper } from '../mappers/prisma-exam-attempt.mapper';
import { PrismaExamAttemptCommandRepository } from './prisma-exam-attempt-command.repository';

describe('PrismaExamAttemptCommandRepository prerequisites', () => {
  let prisma: {
    exam: { findUnique: jest.Mock };
    section: { findMany: jest.Mock };
  };
  let repository: PrismaExamAttemptCommandRepository;

  beforeEach(() => {
    prisma = {
      exam: {
        findUnique: jest.fn().mockResolvedValue({
          section: { courseId: 'course-id', order: 3 },
        }),
      },
      section: { findMany: jest.fn() },
    };
    repository = new PrismaExamAttemptCommandRepository(
      prisma as unknown as PrismaService,
      {} as PrismaExamAttemptMapper,
    );
  });

  it('allows the attempt when every previous section exam was passed', async () => {
    prisma.section.findMany.mockResolvedValue([
      { exam: { passingScore: 60, attempts: [{ score: 40 }, { score: 60 }] } },
      { exam: { passingScore: 70, attempts: [{ score: 80 }] } },
    ]);

    await expect(
      repository.hasPassedAllPreviousExams('member-id', 'exam-id'),
    ).resolves.toBe(true);
  });

  it('blocks the attempt when a previous section exam was not passed', async () => {
    prisma.section.findMany.mockResolvedValue([
      { exam: { passingScore: 60, attempts: [{ score: 60 }] } },
      { exam: { passingScore: 70, attempts: [{ score: 65 }] } },
    ]);

    await expect(
      repository.hasPassedAllPreviousExams('member-id', 'exam-id'),
    ).resolves.toBe(false);
  });
});
