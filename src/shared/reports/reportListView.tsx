import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export interface ReportSummary {
    slug: string,
    display_name: string,
    description: string,
}

export const CASE_TYPES = [
    'BF',
    'BF2',
    'COMP',
    'COMP2',
    'DTEN',
    'FOI',
    'IEDET',
    'MIN',
    'MPAM',
    'MTS',
    'POGR',
    'POGR2',
    'TO',
    'TRO',
] as const;

export type CaseType = typeof CASE_TYPES[number];

interface ReportsForCaseTypeSummaryProps {
    caseType: CaseType,
    summaries: ReportSummary[]
}

const ReportsForCaseTypeSummary = ({ caseType, summaries }: ReportsForCaseTypeSummaryProps) =>
    <div className='govuk-grid-row'>
        <div className='govuk-grid-column-two-thirds'>
            <h2 className='govuk-heading-m'>{caseType}</h2>
            <dl className="govuk-summary-list">
                {summaries.map(({ slug, display_name, description }) =>
                    <div className='govuk-summary-list__row' key={slug}>
                        <dt className="govuk-summary-list__key">
                            {display_name}
                        </dt>
                        <dd className="govuk-summary-list__value">
                            {description}
                        </dd>
                        <dd className="govuk-summary-list__actions">
                            <Link to={`/report/${caseType}/${slug}`} className='govuk-link'>
                                View{' '}
                                <span className='govuk-visually-hidden'>
                                    {caseType}{' '}
                                    {display_name
                                        .toLocaleLowerCase()
                                        .replace(/report$/, '')
                                    }{' '}
                                </span>
                                report
                            </Link>
                        </dd>
                    </div>
                )}
            </dl>
        </div>
    </div>;

const ReportListView = () => {
    const [reportsByCaseType, setReportsByCaseType] = useState<Record<CaseType, ReportSummary[]>>({});
    const [error, setError] = useState<string | null>(null);
    const [responseCount, setResponseCount] = useState<number>(0);

    useEffect(
        () => {
            for (const caseType of CASE_TYPES) {
                axios.get(`/api/report/${caseType}`)
                    .then(response => {
                        setReportsByCaseType(
                            (existing) => ({
                                ...existing,
                                [caseType]: response.data.sort((a, b) => a.display_name.localeCompare(b.display_name))
                            })
                        );
                        setResponseCount(count => count + 1);
                    })
                    .catch(err => {
                        if (![401, 403, 404].includes(err?.response?.status)) {
                            setError(
                                err?.response?.data?.error
                                ?? err?.message
                                ?? 'Requesting the list of reports was not successful'
                            );
                        }
                        setResponseCount(count => count + 1);
                    });
            }
        },
        []
    );

    if (error) {
        return <>
            <h1 className='govuk-heading-l'>Something went wrong</h1>
            <p className='govuk-body'>{error}</p>
        </>;
    }

    if (responseCount < CASE_TYPES.length) {
        return <>
            <h1 className='govuk-heading-l'>List of operational reports</h1>
            <p className='govuk-body'>Loading reports</p>
        </>;
    }

    return <>
        <h1 className='govuk-heading-l'>List of operational reports</h1>
        {Object.keys(reportsByCaseType).length !== 0
            ? Object.entries(reportsByCaseType)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([caseType, summaries]) =>
                    <ReportsForCaseTypeSummary
                        key={caseType}
                        caseType={caseType}
                        summaries={summaries}
                    />
                )
            : <p className='govuk-body'>
                You don&apos;t have permission to access any operational reports.
            </p>
        }
    </>;
};

export default ReportListView;
