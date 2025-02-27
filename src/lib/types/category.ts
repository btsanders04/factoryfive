import { Prisma } from "@prisma/client";

export type CategoryWithTransactions = Prisma.CategoryGetPayload<{
  include: {
    transactions: true
  };
}>;