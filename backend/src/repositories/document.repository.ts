import { prisma } from './prisma';

export class DocumentRepository {
  static async findByEmployeeId(employeeId: string) {
    return prisma.document.findMany({
      where: { employeeId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  static async findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
    });
  }

  static async create(data: {
    employeeId: string;
    title: string;
    fileName: string;
    fileType: string;
    filePath: string;
  }) {
    return prisma.document.create({
      data,
    });
  }

  static async delete(id: string) {
    return prisma.document.delete({
      where: { id },
    });
  }
}
