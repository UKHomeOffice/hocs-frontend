import React from 'react';
import { Button } from '../button.jsx';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Form button component', () => {

    const mockDispatch = jest.fn();

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render with default props', () => {
        const wrapper = render(
            <Button action={'/SOME/URL'} label={'press'} dispatch={() => {}} />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('press')).toBeInTheDocument();
    });

    it('should render disabled when isDisabled is passed', () => {
        const wrapper = render(
            <Button action={'/SOME/URL'} label={'press'} dispatch={() => {}} disabled={true} />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('press')).toHaveAttribute('disabled');
    });

    it('should dispatch action when clicked', () => {
        global.testFunc = () => {};
        const testSpy = jest.spyOn(global, 'testFunc');
        const wrapper = render(
            <Button action={'/SOME/URL'} label={'press'} dispatch={testSpy} />,
            { wrapper: MemoryRouter }
        );

        expect(wrapper).toBeDefined();
        fireEvent.click(screen.getByText('press'));
        expect(testSpy).toHaveBeenCalledTimes(1);
    });

});
