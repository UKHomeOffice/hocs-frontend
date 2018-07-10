import React from 'react';
import Layout from '../layout.jsx';

describe('Page layout component', () => {
    it('should render with default props', () => {
        expect(
            shallow(<Layout />)
        ).toMatchSnapshot();
    });
    it('should render with footer when set', () => {
        expect(
            shallow(<Layout footer={{ isVisible: true }} />)
        ).toMatchSnapshot();
    });
    it('should render with children when passed', () => {
        expect(
            shallow(<Layout>Inside my layout</Layout>)
        ).toMatchSnapshot();
    });
});