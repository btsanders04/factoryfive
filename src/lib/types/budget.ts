import { Prisma } from "@prisma/client";

export type BudgetWithRelations = Prisma.BudgetGetPayload<{
  include: {
    category: {
        include: {
            transactions: {
                include: {
                    builder: true
                }
            }
        }
    }
  };
}>;