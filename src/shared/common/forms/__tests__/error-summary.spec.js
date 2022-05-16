import React from 'react';
import ErrorSummary from '../error-summary.jsx';
import { MemoryRouter } from 'react-router-dom';

// eslint-disable-next-line no-console
const mockScrollIntoView = jest.fn();
const refSpy = jest.spyOn(React, 'createRef').mockImplementation(() => ( { current: { scrollIntoView: mockScrollIntoView } }));

const errors = {
    field1: 'Error 1',
    field2: 'Error 2',
    field3: 'Error 3'
};

describe('Form text component', () => {
    it('should render with default props', () => {
        expect(
            render(<ErrorSummary />)
        ).toMatchSnapshot();
    });
    it('should render with heading when passed', () => {
        expect(
            render(<ErrorSummary heading="Error summary" />)
        ).toMatchSnapshot();
    });
    it('should render with description when passed', () => {
        expect(
            render(<ErrorSummary description="Displaying a list of the errors on the page" />)
        ).toMatchSnapshot();
    });
    it('should render list of errors when passed', () => {

        expect(
            render(
                < MemoryRouter >
                    <ErrorSummary errors={errors} />
                </MemoryRouter >
            )
        ).toMatchSnapshot();
    });

    it('expect scrollIntoView to be called', async () => {
        expect.assertions(2);
        const wrapper = shallow(<ErrorSummary description="Displaying a list of the errors on the page" />);
        const instance = wrapper.instance();

        await instance.componentDidMount();

        expect(refSpy).toBeCalled();
        expect(mockScrollIntoView).toBeCalled();
    });
});
