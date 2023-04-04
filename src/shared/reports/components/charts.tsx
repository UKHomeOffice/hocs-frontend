import { ChartProps, Pie } from 'react-chartjs-2';
import React from 'react';
import { ReportRow } from './dataTable';

/*
 * TODO: Spike implementation - needs to be driven by report metadata to be viable
 * This was a spike to render charts with chart.js. To be production ready the charts shown need to be configurable
 * from the report metadata. This is left here as an example of how to render a chart to be revisited when a use case
 * has been identified.
 */

function buildPieChartDataSet<T>(mapToBucketFunction: (row: T) => string | null): (reportData: T[]) => ChartProps<'pie'>['data'] {
    return (reportData) => {
        const groupedData = reportData
            .reduce<Record<string, number>>(
                (acc: Record<string, number>, row: T) => {
                    const bucket = mapToBucketFunction(row);

                    return bucket ? { ...acc, [bucket]: (acc[bucket] ?? 0) + 1 } : acc;
                },
                {}
            );

        return {
            labels: Object.keys(groupedData),
            datasets: [{
                label: 'Number of cases',
                data: Object.values(groupedData),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
            }],
        };
    };
}

function getCasesWithinServiceStandardByAge(reportData: ReportRow[]): ChartProps<'pie'>['data'] {
    const bins = [5, 10, 15, 20];
    const binLabels = [
        '0 to 5',
        '6 to 10',
        '11 to 15',
        '16 to 20',
    ];

    function getBucket(row: ReportRow): string {
        const age = row['age'] as number;
        const index = bins.findIndex(threshold => threshold >= age);
        return binLabels[index] ?? 'More than 20';
    }

    const dataWithinStandard = reportData.filter(row => !row['outside_service_standard']);

    return buildPieChartDataSet(getBucket)(dataWithinStandard);
}

function getCasesWithinServiceStandardByBusinessArea(reportData: ReportRow[]): ChartProps<'pie'>['data'] {
    const dataWithinStandard = reportData.filter(row => !row['outside_service_standard']);

    return buildPieChartDataSet<ReportRow>(row => row['business_area']?.toString())(dataWithinStandard);
}

function getCasesWithinServiceStandardByStage(reportData: ReportRow[]): ChartProps<'pie'>['data'] {
    const dataWithinStandard = reportData.filter(row => !row['outside_service_standard']);

    return buildPieChartDataSet<ReportRow>(row => row['stage_name']?.toString())(dataWithinStandard);
}

interface ChartsProps {
    data: ReportRow[]
}

export const Charts = ({ data }: ChartsProps) => {
    return <div className='govuk-grid-row'>
        <div className='govuk-grid-column-one-third'>
            <h2 className='govuk-heading-m'>Cases within service standard by age</h2>
            <Pie
                data={getCasesWithinServiceStandardByAge(data)}
                fallbackContent={<p>TODO: screen reader representation goes here</p>}
            />
        </div>
        <div className='govuk-grid-column-one-third'>
            <h2 className='govuk-heading-m'>Cases within service standard by business area</h2>
            <Pie
                data={getCasesWithinServiceStandardByBusinessArea(data)}
                fallbackContent={<p>TODO: screen reader representation goes here</p>}
            />
        </div>
        <div className='govuk-grid-column-one-third'>
            <h2 className='govuk-heading-m'>Cases within service standard by stage</h2>
            <Pie
                data={getCasesWithinServiceStandardByStage(data)}
                fallbackContent={<p>TODO: screen reader representation goes here</p>}
            />
        </div>
    </div>;
};
