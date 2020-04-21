import React from 'react';
import CaseNote from '../case-note.jsx';

describe('When the component is rendered', () => {
    const mockDispatch = jest.fn();
    const useContextSpy = jest.spyOn(React, 'useContext').mockImplementation(() => ({
        dispatch: mockDispatch,
        page: {
            params: {
                caseId: '__caseId__'
            }
        },
        track: jest.fn(),
        hasRole: jest.fn().mockReturnValue(true)
    }));

    it('should match the snapshot', () => {
        const props = {
            author: '__author__',
            date: '__date__',
            modifiedBy: '__modifiedBy__',
            modifiedDate: '__modifiedDate__',
            note: '__note__',
            timelineItemUUID: '__timelineItemUUID__',
            title: '__title__'
        };
        const wrapper = shallow(<CaseNote {...props} />);

        expect(wrapper).toBeDefined();
        expect(useContextSpy).toHaveBeenCalled();
        expect(wrapper).toMatchSnapshot();
    });
});