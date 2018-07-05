import React from 'react';
import Error from '../error.jsx';

describe('Error component', () => {
    it('should render with default props', () => {
        expect(
            render(<Error/>)
        ).toMatchSnapshot();
    });
    it('should render with location when passed', () => {
        const props = {
            location: {
                pathname: '/some/unknown/path'
            }
        };
        expect(
            render(<Error {...props}/>)
        ).toMatchSnapshot();
    });
    it('should render with a stack trace when passed', () => {
        const props = {
            stack: 'Stack trace...'
        };
        expect(
            render(<Error {...props}/>)
        ).toMatchSnapshot();
    });
    it('should pass the error code to the static context', () => {
        const props = {
            staticContext: {}
        };
        const wrapper = mount(<Error {...props}/>);
        expect(wrapper).toBeDefined();
        expect(wrapper.prop('staticContext')).toEqual({status: 500});
    });
});