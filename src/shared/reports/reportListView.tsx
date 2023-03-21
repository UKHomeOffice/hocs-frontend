import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface ReportSummary {
    slug: string,
    display_name: string,
}

const ReportView = () => {
    const [reportsList, setReportsList] = useState<ReportSummary[] | null>(null);

    useEffect(
        () => {
            axios.get('/api/report')
                .then(response => setReportsList(response.data));
        },
        []
    );

    return <div>
        <h1 className='govuk-heading-l'>List of operational reports</h1>
        {reportsList !== null
            ? reportsList.map(({ slug, display_name }) =>
                <div className='report-summary card' key={slug}>
                    <Link to={`/report/${slug}`} className='govuk-link'>
                        {display_name}
                    </Link>
                </div>
            )
            : <p className='govuk-body'>Loading reports</p>
        }
    </div>;
};

export default ReportView;
