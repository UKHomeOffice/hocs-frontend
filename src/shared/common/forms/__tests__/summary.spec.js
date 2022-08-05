import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Summary from '../summary';

describe('Summary', () => {

    const summary = [
        {
            label: 'Test Label',
            attribute: 'TestField'
        }
    ];

    test('should not render rows without data ', () => {
        const wrapper = render(<Summary summary={summary}/>);

        expect(wrapper).toBeDefined();
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    test('should render rows with data ', () => {
        const data = {
            TestField: 'Test Field Value'
        };

        const wrapper = render(<Summary summary={summary} data={data}/>);

        expect(wrapper).toBeDefined();
        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('Test Field Value')).toBeInTheDocument();
    });

    test('should render rows with custom renderer', () => {
        const summary = [
            {
                label: 'Test Label',
                attribute: 'TestField',
                renderer: 'currency'
            }
        ];
        const data = {
            TestField: '100'
        };

        const wrapper = render(<Summary summary={summary} data={data}/>);

        expect(wrapper).toBeDefined();
        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('£100')).toBeInTheDocument();
    });

});
