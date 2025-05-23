'use client';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

import { usePathname, useSearchParams } from 'next/navigation';
import { generatePagination } from '@/lib/utils';

export function PaginationDemo({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: string | number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem hidden={currentPage === 1}>
          <PaginationPrevious
            href={
              currentPage === 1 ? undefined : createPageURL(currentPage - 1)
            }
            hidden={currentPage === 1}
          />
        </PaginationItem>
        {allPages.map((page, index) => (
          <PaginationItem key={index}>
            {typeof page === 'number' ? (
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis>{page}</PaginationEllipsis>
            )}
          </PaginationItem>
        ))}
        <PaginationItem hidden={currentPage === totalPages}>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            hidden={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
