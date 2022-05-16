import React from 'react';
import Error from '../error.jsx';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Error component', () => {
    it('should render with default props', () => {
        const wrapper = render(<Error />);
        expect(wrapper).toBeDefined();
    });

    it('should render with location when 404 passed', () => {
        const props = {
            error: {
                status: 404,
                location: {
                    pathname: '/SOME/UNSUPPORTED/ENDPOINT'
                }
            }
        };
        render(<Error {...props} />);
        expect(screen.getByText('/SOME/UNSUPPORTED/ENDPOINT')).toBeInTheDocument();
    });

    it('should render when 403 passed', () => {
        const props = {
            error: {
                status: 403,
                location: {
                    pathname: '/SOME/UNSUPPORTED/ENDPOINT'
                }
            }
        };
        render(<Error {...props} />);
        expect(screen.getByText('You do not have permission')).toBeInTheDocument();
    });

    it('should render with a stack trace when passed', () => {
        const props = {
            error: {
                stack: 'Stack trace...'
            }
        };
        render(<Error {...props} />);
        expect(screen.getByText('Stack trace...')).toBeInTheDocument();
    });
});
