import { db } from '@/lib/db';
import isOnline from 'is-online';
export const fetchRecords = async ({
  take = 5,
  skip = 0,
  query,
}: {
  query?: string;
  take: number;
  skip: number;
}) => {
  const isOnlineResult = await isOnline();

  if (!isOnlineResult) {
    throw new Error('No internet connection');
    return;
  }
  ('use server');
  try {
    const results = await db.transaction.findMany({
      where: {
        id: { contains: query, mode: 'insensitive' },
      },
      skip,
      take,
      select: {
        id: true,
        totalAmount: true,
        createdAt: true,
        isComplete: true,
        products: {
          select: {
            id: true,
            productId: true,
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Hitung total quantity untuk setiap transaksi
    const resultsWithTotalQuantity = results.map((transaction) => {
      const totalQuantity = transaction.products.reduce(
        (sum, product) => sum + product.quantity,
        0
      );
      return {
        ...transaction,
        totalQuantity,
      };
    });

    const totalTransactions = await db.transaction.count();

    return {
      data: resultsWithTotalQuantity,
      metadata: {
        hasNextPage: skip + take < totalTransactions,
        totalPages: Math.ceil(totalTransactions / take),
      },
    };
  } finally {
    await db.$disconnect();
  }
};
