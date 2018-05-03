import React from "react";
import Header from "../header.jsx";

describe('Layout header component', () => {
    it('should render with default props', () => {
        expect(
            render(<Header/>)
        ).toMatchSnapshot();
    });
    it('should render the menu when passed', () => {
        const props = {
            menu: [
                {label: 'first', target: '/'},
                {label: 'second', target: '/'}
            ]
        };
        expect(
            shallow(<Header {...props}/>)
        ).toMatchSnapshot();
    });
});