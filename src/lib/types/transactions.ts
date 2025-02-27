import { Prisma } from "@prisma/client";

// Type with specific included relations
export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    category: true;
    builder: true;
  };
}>;

// Type with specific included relations
export type TransactionWithBuilder = Prisma.TransactionGetPayload<{
  include: {
    builder: true;
  };
}>;