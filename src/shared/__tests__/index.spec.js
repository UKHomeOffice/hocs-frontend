import React, {Component} from "react";
import {MemoryRouter} from "react-router-dom";
import App from "../index.jsx";

describe('Shared entry point', () => {
    it('should display the correct component for the given route', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('WorkstackPage')).toHaveLength(1);
        expect(wrapper.find('Error')).toHaveLength(0);
    });
});

describe('Shared entry point', () => {
    it('should redirect to 404 if given an invalid route', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={['/some/random/url']}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('WorkstackPage')).toHaveLength(0);
        expect(wrapper.find('Error')).toHaveLength(1);
    });
});