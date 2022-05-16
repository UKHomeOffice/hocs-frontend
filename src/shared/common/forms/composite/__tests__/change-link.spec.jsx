import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ChangeLink from '../change-link';

describe('The ChangeLink component', () => {

    const target = '/target';
    const label = 'some heading label';
    const name = 'some_name';
    const data = {
        valueToChange: 'change_me_please'
    };
    const changeValue = 'valueToChange';

    const defaultProps = {
        target: target,
        label: label,
        name: name,
        data: data,
        changeValue: changeValue
    };

    it('should render with default props', () => {

        const sut = render(
            <MemoryRouter>
                <ChangeLink  {...defaultProps} />
            </MemoryRouter>
        );
        expect(sut).toBeDefined();
        expect(sut).toMatchSnapshot();
    });
});
