import React from 'react';
import Stage from '../stage.jsx';

jest.mock('../form-enabled.jsx', () => (
    (C) => C
));

jest.mock('../../common/components/document-pane.jsx', () => (
    'div'
));

describe('Stage page component', () => {

    it('should render with default props', () => {
        const wrapper = shallow(<Stage/>);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with title when passed in props', () => {
        const wrapper = shallow(<Stage title='MY_TITLE'/>);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with subTitle when passed in props', () => {
        const mockForm = { caseReference: 'ABC123' };
        const wrapper = shallow(<Stage form={mockForm}/>);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render without sidebar when passed in props', () => {
        const wrapper = shallow(<Stage hasSidebar='false'/>);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render children when passed', () => {
        const wrapper = shallow(
            <Stage>
                FORM
            </Stage>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

});