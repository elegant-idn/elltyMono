import clsx from "clsx";
import { nanoid } from "nanoid";
import React from "react";
import s from "./TemplatesPagination.module.scss";

interface TemplatesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => unknown;
}

export const TemplatesPagination: React.FC<TemplatesPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevPageClick = () => {
    onPageChange?.(currentPage - 1);
  };

  const handleNextPageClick = () => {
    onPageChange?.(currentPage + 1);
  };

  const renderPaginationElements = () => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) {
      arr.push(i);
    }

    const elements = [];

    const commonProps = {
      currentPage: currentPage,
      onClick: (page: number) => onPageChange?.(page),
    };
    // if the first page
    if (currentPage == 1) {
      // show page 1 to 5 (1 is active)
      elements.push(
        arr.slice(currentPage - 1, currentPage + 4).map((item: any) => {
          return (
            <TemplatesPaginationItem
              {...commonProps}
              key={item}
              pageNumber={item}
            />
          );
        })
      );

      if (arr.length - currentPage > 5) {
        elements.push(
          <div key={nanoid(5)} className={s.paginationItem}>
            ...
          </div>
        );
      }

      if (arr.length - currentPage > 4) {
        elements.push(
          <TemplatesPaginationItem
            {...commonProps}
            key={arr.length}
            pageNumber={arr.length}
          />
        );
      }

      // if the second page
    } else if (currentPage == 2) {
      // show page 1 to 5 (2 is active)
      elements.push(
        arr.slice(currentPage - 2, currentPage + 3).map((item: any) => {
          return (
            <TemplatesPaginationItem
              {...commonProps}
              key={item}
              pageNumber={item}
            />
          );
        })
      );

      if (arr.length - currentPage > 4) {
        elements.push(
          <div key={nanoid(5)} className={s.paginationItem}>
            ...
          </div>
        );
      }

      if (arr.length - currentPage > 3) {
        elements.push(
          <TemplatesPaginationItem
            {...commonProps}
            key={arr.length}
            pageNumber={arr.length}
          />
        );
      }

      // if the last page
    } else if (currentPage == arr.length && totalPages > 4) {
      elements.push(
        arr.slice(currentPage - 5, currentPage + 1).map((item: any) => {
          return (
            <TemplatesPaginationItem
              {...commonProps}
              key={item}
              pageNumber={item}
            />
          );
        })
      );

      if (currentPage - 1 > 5) {
        elements.unshift(
          <div key={nanoid(5)} className={s.paginationItem}>
            ...
          </div>
        );
      }

      if (currentPage - 1 > 4) {
        elements.unshift(
          <TemplatesPaginationItem {...commonProps} key={1} pageNumber={1} />
        );
      }

      // if the second-to-last page
    } else if (currentPage == arr.length - 1 && totalPages > 4) {
      elements.push(
        arr.slice(currentPage - 4, currentPage + 2).map((item: any) => {
          return (
            <TemplatesPaginationItem
              {...commonProps}
              key={item}
              pageNumber={item}
            />
          );
        })
      );

      if (currentPage - 1 > 4) {
        elements.unshift(
          <div key={nanoid(5)} className={s.paginationItem}>
            ...
          </div>
        );
      }

      if (currentPage - 1 > 3) {
        elements.unshift(
          <TemplatesPaginationItem {...commonProps} key={1} pageNumber={1} />
        );
      }
    } else {
      elements.push(
        arr.slice(currentPage - 3, currentPage + 2).map((item: any) => {
          return (
            <TemplatesPaginationItem
              {...commonProps}
              key={item}
              pageNumber={item}
            />
          );
        })
      );

      if (currentPage - 1 > 3) {
        elements.unshift(
          <div key={nanoid(5)} className={s.paginationItem}>
            ...
          </div>
        );
      }

      if (currentPage - 1 > 2) {
        elements.unshift(
          <TemplatesPaginationItem {...commonProps} key={1} pageNumber={1} />
        );
      }

      if (arr.length - currentPage > 3) {
        elements.push(
          <div key={nanoid(5)} className={s.paginationItem}>
            ...
          </div>
        );
      }

      if (arr.length - currentPage > 2) {
        elements.push(
          <TemplatesPaginationItem
            {...commonProps}
            key={arr.length}
            pageNumber={arr.length}
          />
        );
      }
    }

    return elements;
  };

  return (
    <div className={s.pagination}>
      <div
        className={clsx(
          s.paginationArrow,
          s.left,
          currentPage == 1 && s.disabled
        )}
        onClick={handlePrevPageClick}
      >
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
          <path
            d="M4.99309 1L1.04297 4.95013L5.05069 8.95785"
            stroke="#36373C"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {renderPaginationElements()}
      <div
        className={clsx(
          s.paginationArrow,
          s.right,
          currentPage == totalPages && s.disabled
        )}
        onClick={handleNextPageClick}
      >
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
          <path
            d="M4.99309 1L1.04297 4.95013L5.05069 8.95785"
            stroke="#36373C"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

interface TemplatesPaginationItemProps {
  currentPage: number;
  pageNumber: number;
  onClick?: (page: number) => unknown;
}

const TemplatesPaginationItem: React.FC<TemplatesPaginationItemProps> = ({
  currentPage,
  pageNumber,
  onClick,
}) => {
  return (
    <div
      key={nanoid(5)}
      className={clsx(s.paginationItem, currentPage === pageNumber && s.active)}
      onClick={() => onClick?.(pageNumber)}
    >
      {pageNumber}
    </div>
  );
};
