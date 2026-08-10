import { Certification } from '../domain/certification';
import { CertificationFactory } from '../domain/factories/certification.factory';
import { CertificationsCommandService } from './certifications-command.service';
import { CertificationCommandRepository } from './ports/certification-command.repository';

describe('CertificationsCommandService', () => {
  it('stores the rounded average of passing attempt scores', async () => {
    const certification = { id: 'certification-id' } as Certification;
    const repository = {
      getCourseCompletionSnapshot: jest.fn().mockResolvedValue({
        courseId: 'course-id',
        exams: [{ passedAttemptScore: 60 }, { passedAttemptScore: 85 }],
      }),
      existsForCourseAndMember: jest.fn().mockResolvedValue(false),
      save: jest.fn(),
    };
    const factory = {
      createNew: jest.fn().mockReturnValue(certification),
    };
    const service = new CertificationsCommandService(
      repository as unknown as CertificationCommandRepository,
      factory as unknown as CertificationFactory,
    );

    const result = await service.issueIfCourseCompleted('exam-id', 'member-id');

    expect(factory.createNew).toHaveBeenCalledWith(
      'course-id',
      'member-id',
      73,
    );
    expect(repository.save).toHaveBeenCalledWith(certification);
    expect(result).toBe(certification);
  });

  it('does not issue a certificate when any exam has no passing attempt', async () => {
    const repository = {
      getCourseCompletionSnapshot: jest.fn().mockResolvedValue({
        courseId: 'course-id',
        exams: [{ passedAttemptScore: 80 }, { passedAttemptScore: null }],
      }),
      existsForCourseAndMember: jest.fn(),
      save: jest.fn(),
    };
    const factory = { createNew: jest.fn() };
    const service = new CertificationsCommandService(
      repository as unknown as CertificationCommandRepository,
      factory as unknown as CertificationFactory,
    );

    const result = await service.issueIfCourseCompleted('exam-id', 'member-id');

    expect(result).toBeNull();
    expect(factory.createNew).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });
});
