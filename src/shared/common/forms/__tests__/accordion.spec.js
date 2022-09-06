import React from 'react';
import Accordion from '../accordion';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const createItem = name => ({ props: { name } });

describe('When the Accordion component is rendered', () => {
    const updateState = jest.fn();
    const sections = [{
        items: [createItem('item1'), createItem('item2'), createItem('item2')],
        title: 'section1'
    }, {
        items: [createItem('item4'), createItem('item5'), createItem('item6')],
        title: 'section2'
    }];

    describe('and there are no validation errors', () => {
        test('should have the sections', () => {
            const instance = render(<Accordion name="accordion" sections={sections} data={{}} updateState={updateState} page={{}} />);
            expect(instance).toBeDefined();
            expect(screen.getByText('section1')).toBeInTheDocument();
            expect(screen.getByText('section2')).toBeInTheDocument();
        });
    });

    describe('render the show/hide all section toggle', () => {
        test('should render the toggle when more than one section in the accordion', () => {
            const instance = render(<Accordion name="accordion" sections={sections} data={{}} updateState={updateState} page={{}} />);
            expect(instance).toBeDefined();
            expect(screen.getByText('Show all sections')).toBeInTheDocument();
        });

        test('should not render the toggle when only one section in the accordion', () => {
            const instance = render(<Accordion name="accordion" sections={[sections[0]]} data={{}} updateState={updateState} page={{}} />);
            expect(instance).toBeDefined();
            expect(screen.queryByText('Show all sections')).not.toBeInTheDocument();
        });
    });

    describe('and there are validation errors', () => {
        test('should match the snapshot, having the effected section expanded', () => {
            const instance = render(
                <Accordion name="accordion"
                    errors={{ accordion: 'A validation error' }}
                    sections={sections} data={{}}
                    updateState={updateState}
                    page={{}}
                />);
            expect(instance).toBeDefined();
            expect(screen.getByText('section1')).toBeInTheDocument();
            expect(screen.getByText('A validation error')).toBeInTheDocument();
        });
    });
});
