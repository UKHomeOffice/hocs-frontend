import React from 'react';
import Header from '../header.jsx';

describe('Layout header component', () => {
    it('should render with default props', () => {
        expect(
            shallow(<Header />)
        ).toMatchSnapshot();
    });

    it('should render without crest when service is not GOV.UK', () => {
        expect(
            shallow(<Header service={'Test Service'}/>)
        ).toMatchSnapshot();
    });
});