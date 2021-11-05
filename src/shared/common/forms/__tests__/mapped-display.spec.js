import React from 'react';
import MappedDisplay from '../mapped-display.jsx';


describe('Form MappedDisplay component', () => {
    it('should render checkbox', () => {
        const choices = [
            { label: 'isA', value: 'true' }
        ];
        expect(
            render(<MappedDisplay label="" component="checkbox" choices={choices}/>)
        ).toMatchSnapshot();
    });

    it('should render date', () => {
        expect(
            render(<MappedDisplay label="When" component="date" value="2021-05-17"/>)
        ).toMatchSnapshot();
    });

    it('should render radio', () => {
        const choices = [
            { label: 'Yes - accept the complaint', value: 'Yes' },
            { label: 'No - transfer the complaint', value: 'No' }
        ];
        expect(
            render(<MappedDisplay label="Gender" component="radio" value="Male" choices={choices}/>)
        ).toMatchSnapshot();
    });

    it('should render text', () => {
        expect(
            render(<MappedDisplay label="Company Name" component="text" value="Waller Porter Traders"/>)
        ).toMatchSnapshot();
    });

    it('should render choice option B1 value', () => {

        const choices = [
            { label: 'A Value', value: 'A', options: [{ label: 'A Option 1', value: 'A1' } ,{ label: 'A Option 2', value: 'A2' }] },
            { label: 'B Value', value: 'B', options: [{ label: 'B Option 1', value: 'B1' } ,{ label: 'B Option 2', value: 'B2' }] }

        ];
        expect(
            render(<MappedDisplay label="Field Label" component="mapped-display" value="B1" choices={choices} />)
        ).toMatchSnapshot();
    });
});
