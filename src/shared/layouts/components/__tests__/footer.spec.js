import React from 'react';
import Footer from '../footer.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Layout footer component', () => {
    it('should render with default props', () => {
        expect(
            render(<Footer />)
        ).toMatchSnapshot();
    });
    it('should render with links when passed', () => {
        const props = {
            links: [
                { label: 'first', target: '/' },
                { label: 'second', target: '/' }
            ]
        };
        expect(
            render(<Footer {...props} />)
        ).toMatchSnapshot();
    });
    it('should show OGL when asked', () => {
        const props = {
            showOGL: true
        };
        expect(
            render(<Footer {...props} />)
        ).toMatchSnapshot();
    });
});
