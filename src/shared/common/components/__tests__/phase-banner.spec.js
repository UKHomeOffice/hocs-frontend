import React from 'react';
import PhaseBanner from '../phase-banner.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Phase Banner component', () => {
    it('should render with default props', () => {
        expect(
            render(<PhaseBanner />)
        ).toMatchSnapshot();
    });
    it('should display the correct phase when passed', () => {
        expect(
            render(<PhaseBanner phase="BETA" />)
        ).toMatchSnapshot();
    });
    it('should display the correct feedback url when passed', () => {
        expect(
            render(<PhaseBanner feedback="http://some.domain" />)
        ).toMatchSnapshot();
    });
    it('should display the correct test notice when isNotProd === 1', () => {
        expect(
            render(<PhaseBanner isNotProd={true} />)
        ).toMatchSnapshot();
    });
    it('should display the correct test notice when isNotProd === 0', () => {
        expect(
            render(<PhaseBanner isNotProd={false} />)
        ).toMatchSnapshot();
    });
});
