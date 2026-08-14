import { Prisma } from 'src/generated/prisma/client';

export type LessonWithAttachments = Prisma.LessonGetPayload<{
  include: { attachments: true };
}>;

export type CourseWithSections = Prisma.CourseGetPayload<{
  include: { sections: true; tags: true };
}>;

export type QuestionsBankWithQuestionChoices = Prisma.QuestionsBankGetPayload<{
  include: { choices: true };
}>;

export type DemoWithDepartments = Prisma.DemoGetPayload<{
  include: { departments: true };
}>;

export type DemoMemberWithUser = Prisma.DemoMemberGetPayload<{
  include: { user: true };
}>;

export type CertificationWithDetails = Prisma.CertificationGetPayload<{
  select: {
    id: true;
    courseId: true;
    score: true;
    issuedAt: true;
    createdAt: true;
    updatedAt: true;
    course: {
      select: {
        title: true;
        signatureImagePath: true;
      };
    };
    demoMember: {
      select: {
        user: {
          select: {
            firstName: true;
            lastName: true;
          };
        };
        demo: {
          select: {
            name: true;
            imagePath: true;
          }
        }
      };
    };
  };
}>;

export type DemoWithMemberCount = Prisma.DemoGetPayload<{
  include: {
    _count: { select: { members: true; departments: true } };
    owner: { select: { firstName: true; lastName: true } };
  };
}>;

export type DemoWithOwnership = DemoWithMemberCount & { isOwner: boolean };

export type CourseWithDemo = Prisma.CourseGetPayload<{
  include: {
    demo: true;
    tags: true;
  };
}>;

export type AssetWithCourse = Prisma.AssetGetPayload<{
  include: {
    course: true;
  };
}> & {
  course: CourseWithStats;
};

export type DepartmentCourseWithAssetWithCourse =
  Prisma.DepartmentCourseGetPayload<{
    include: {
      asset: true;
    };
  }> & {
    asset: AssetWithCourse;
  };

export type CourseWithStats = CourseWithDemo & {
  _count?: {
    sections: number;
  };
  totalLessons: number;
  totalDuration: number;
};

export type DepartmentWithCounts = Prisma.DepartmentGetPayload<{
  include: {
    _count: { select: { members: true; courses: true } };
  };
}>;

export type DepartmentWithDetails = DepartmentWithCounts & {
  isJoined: boolean;
};

export type DepartmentMemberWithUser = Prisma.DepartmentMemberGetPayload<{
  include: {
    demoMember: {
      include: {
        user: true;
      };
    };
  };
}>;

export type InvitationWithUserAndDemo = Prisma.InvitationGetPayload<{
  include: {
    sender: true;
    demo: true;
  };
}>;

export type DiscussionQuestionWithDemoMember =
  Prisma.DiscussionQuestionGetPayload<{
    include: {
      demoMember: {
        include: {
          user: true;
        };
      };
      answers: {
        include: {
          demoMember: {
            include: {
              user: true;
            };
          };
        };
      };
    };
  }>;

export type DiscussionAnswerWithDemoMember = Prisma.DiscussionAnswerGetPayload<{
  include: {
    demoMember: {
      include: {
        user: true;
      };
    };
  };
}>;

export type DepartmentMessageWithSenderAndReply =
  Prisma.DepartmentMessageGetPayload<{
    include: {
      sender: {
        select: {
          id: true;
          demoMember: {
            select: {
              user: {
                select: {
                  id: true;
                  firstName: true;
                  lastName: true;
                  imagePath: true;
                };
              };
            };
          };
        };
      };
      replyTo: {
        select: {
          id: true;
          content: true;
          type: true;
        };
      };
    };
  }>;

export type InquiryWithDemoMember = Prisma.InquiryGetPayload<{
  include: {
    creator: {
      include: {
        user: true;
      };
    };
  };
}>;

export type InquiryWithReply = Prisma.InquiryGetPayload<{
  include: {
    creator: {
      include: {
        user: true;
      };
    };
    reply: {
      include: {
        sender: {
          include: {
            user: true;
          };
        };
      };
    };
  };
}>;

export type InquiryReplyWithDemoMember = Prisma.InquiryReplyGetPayload<{
  include: {
    sender: {
      include: {
        user: true;
      };
    };
  };
}>;

export interface UserDashboardStats {
  totalUsers: number;
  verifiedAccounts: number;
  newThisMonth: number;
  twoFactorEnabled: number;
}

export interface AdminDemoStats {
  totalCompanies: number;
  activeCompanies: number;
  newCompaniesThisMonth: number;
  totalMembers: number;
}
