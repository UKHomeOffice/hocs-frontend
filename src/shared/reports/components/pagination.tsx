import React, { PropsWithChildren } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

interface ShowingMessageProps {
    currentPage: number
    pageSize: number
    filteredRecords: number
    totalRecords: number
}

const ShowingMessage = ({ currentPage, pageSize, filteredRecords, totalRecords }: ShowingMessageProps) => {
    if(totalRecords === filteredRecords) {
        return null;
    }

    if(filteredRecords === 0) {
        return <p className='govuk-hint' data-testid='showing-message'>
            None of the {totalRecords} rows match your filters.
        </p>;
    }

    const start = (currentPage * pageSize + 1);
    const end = Math.min((currentPage + 1) * pageSize, filteredRecords);

    const excludedRecords = totalRecords - filteredRecords;
    return <p className='govuk-hint' data-testid='showing-message'>
        Showing rows {start} to {end} of {filteredRecords} matching result{filteredRecords !== 1 ? 's' : ''}.{' '}
        {excludedRecords} result{excludedRecords === 1 ? ' is' : 's were'} hidden because{' '}
        {excludedRecords === 1 ? 'it' : 'they'} don&apos;t match current filters.
    </p>;
};

interface PaginationLinkProps extends PropsWithChildren<Omit<LinkProps, 'to'>>{
    newPage: number
    currentPage: number
    location: RouteComponentProps['location']
}

const PaginationLink = ({ newPage, currentPage, location, children, ...props }: PaginationLinkProps) => {
    const search = new URLSearchParams(location.search);
    if (newPage === 0) {
        search.delete('page');
    } else {
        search.set('page', newPage.toString());
    }

    const to = `${location.pathname}?${search.toString()}`;

    return <Link to={to}
        className='govuk-link govuk-pagination__link'
        aria-current={newPage === currentPage ? 'page' : false}
        {...props}>
        {children}
    </Link>;
};

interface PaginationProps {
    currentPage: number
    pageSize: number
    filteredRecords: number
    totalRecords: number
    location: RouteComponentProps['location']
}

const range = (start: number, stop: number, step = 1): number[] =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

export const Pagination = ({ currentPage, pageSize, filteredRecords, totalRecords, location }: PaginationProps) => {
    const showingMessage =
        <ShowingMessage
            currentPage={currentPage}
            pageSize={pageSize}
            filteredRecords={filteredRecords}
            totalRecords={totalRecords}
        />;

    if (filteredRecords <= pageSize) {
        return showingMessage;
    }

    const pageCount = Math.ceil(filteredRecords / pageSize);
    currentPage = Math.max(0, Math.min(pageCount, currentPage));
    const rangeStart = currentPage < 4 || pageCount < 5 ? 1 : Math.min(currentPage - 1, pageCount - 4);
    const rangeEnd = currentPage > pageCount - 5 ? pageCount - 2 : Math.max(currentPage + 1, 3);

    return <>
        {showingMessage}
        <nav className="govuk-pagination" role="navigation" aria-label="Report pages">
            {currentPage > 0 &&
            <div className="govuk-pagination__prev">
                <PaginationLink currentPage={currentPage} newPage={currentPage - 1} location={location} rel='prev'>
                    <svg className="govuk-pagination__icon govuk-pagination__icon--prev"
                        xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false"
                        viewBox="0 0 15 13">
                        <path
                            d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
                    </svg>
                    <span className="govuk-pagination__link-title">Previous</span>
                </PaginationLink>
            </div>
            }
            <ul className="govuk-pagination__list">
                <li className={`govuk-pagination__item${currentPage === 0 ? ' govuk-pagination__item--current' : ''}`}>
                    <PaginationLink currentPage={currentPage} newPage={0} location={location} aria-label='Page 1'>
                    1
                    </PaginationLink>
                </li>
                {rangeStart > 1 && <li className="govuk-pagination__item govuk-pagination__item--ellipses">⋯</li>}
                {range(rangeStart, rangeEnd).map(page =>
                    <li key={page}
                        className={`govuk-pagination__item${currentPage === page ? ' govuk-pagination__item--current' : ''}`}
                    >
                        <PaginationLink
                            currentPage={currentPage}
                            newPage={page}
                            location={location}
                            aria-label={`Page ${page + 1}`}
                        >
                            {page + 1}
                        </PaginationLink>
                    </li>
                )}
                {rangeEnd < pageCount - 2 && <li className="govuk-pagination__item govuk-pagination__item--ellipses">⋯</li>}
                <li className={`govuk-pagination__item${currentPage === pageCount - 1 ? ' govuk-pagination__item--current' : ''}`}>
                    <PaginationLink
                        currentPage={currentPage}
                        newPage={pageCount - 1}
                        location={location}
                        aria-label={`Page ${pageCount}`}
                    >
                        {pageCount}
                    </PaginationLink>
                </li>
            </ul>
            {currentPage < pageCount - 1 &&
            <div className="govuk-pagination__next">
                <PaginationLink currentPage={currentPage} newPage={currentPage + 1} location={location} rel='next'>
                    <span className="govuk-pagination__link-title">Next</span>
                    <svg className="govuk-pagination__icon govuk-pagination__icon--next"
                        xmlns="http://www.w3.org/2000/svg"
                        height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
                        <path
                            d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
                    </svg>
                </PaginationLink>
            </div>
            }
        </nav>
    </>;
};
