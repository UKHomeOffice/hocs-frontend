// import React from 'react';
// import CaseNote from '../case-note.jsx';
//
// describe('When the component is rendered', () => {
//     const mockDispatch = jest.fn();
//     const useContextSpy = jest.spyOn(React, 'useContext').mockImplementation(() => ({
//         dispatch: mockDispatch,
//         page: {
//             params: {
//                 caseId: '__caseId__'
//             }
//         },
//         track: jest.fn(),
//         hasRole: jest.fn().mockReturnValue(true)
//     }));
//
//     it('should match the snapshot', () => {
//         const props = {
//             author: '__author__',
//             date: '__date__',
//             modifiedBy: '__modifiedBy__',
//             modifiedDate: '__modifiedDate__',
//             note: '__note__',
//             timelineItemUUID: '__timelineItemUUID__',
//             title: '__title__'
//         };
//         const wrapper = shallow(<CaseNote {...props} />);
//
//         expect(wrapper).toBeDefined();
//         expect(useContextSpy).toHaveBeenCalled();
//         expect(wrapper).toMatchSnapshot();
//     });
// });



// import React so you can use JSX (React.createElement) in your test
import React from 'react';
import CaseNote from '../case-note.jsx';
import '@testing-library/jest-dom';

/**
 * render: lets us render the component as React would
 * screen: a utility for finding elements the same way the user does
 */
import {render, screen} from '@testing-library/react'

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

    test('should match the snapshot', () => {
        const props = {
            author: '__author__',
            date: '__date__',
            modifiedBy: '__modifiedBy__',
            modifiedDate: '__modifiedDate__',
            note: '__note__',
            timelineItemUUID: '__timelineItemUUID__',
            title: '__title__'
        };

        const wrapper = render(<CaseNote {...props} />);
        expect(wrapper).toBeDefined();
        expect(useContextSpy).toHaveBeenCalled();

        expect(screen.getByText('Edited on __modifiedDate__ - __modifiedBy__')).toBeInTheDocument();


        //expect(wrapper).toMatchSnapshot();
    });
});
