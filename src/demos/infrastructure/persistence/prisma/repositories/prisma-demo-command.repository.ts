import { Injectable } from '@nestjs/common';
import { DemoCommandRepository } from 'src/demos/application/ports/demo-command.repository';
import { Demo } from 'src/demos/domain/demo';
import { PrismaDemoMapper } from '../mappers/prisma-demo.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PrismaDepartmentMapper } from '../mappers/prisma-department.mapper';

@Injectable()
export class PrismaDemoCommandRepository implements DemoCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaDemoMapper,
    private readonly departmentMapper: PrismaDepartmentMapper,
  ) {}

  async save(demo: Demo): Promise<void> {
    const demoData = this.mapper.toPersistence(demo);

    const departmentsData = demo.departments.map((dept) =>
      this.departmentMapper.toPersistence(dept),
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.demo.upsert({
        where: { id: demo.id },
        update: demoData,
        create: demoData,
      });

      for (const dept of departmentsData) {
        await tx.department.upsert({
          where: { id: dept.id },
          update: dept,
          create: dept,
        });
      }

      const currentDeptIds = departmentsData.map((d) => d.id);
      await tx.department.deleteMany({
        where: {
          demoId: demo.id,
          id: { notIn: currentDeptIds },
        },
      });
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.demo.delete({ where: { id } });
  }

  async findById(id: string): Promise<Demo | null> {
    const demo = await this.prisma.demo.findUnique({
      where: { id },
      include: { departments: true },
    });
    return demo ? this.mapper.toDomain(demo) : null;
  }
}
