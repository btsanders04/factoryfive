import { Prisma } from "@prisma/client";

export type TaskSectionWithRelations = Prisma.TaskSectionGetPayload<{
  include: {
    tasks: true;
  };
}>;
