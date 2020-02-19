import React from 'react';
import SessionTimer from '../session-timer.jsx';
import { ApplicationProvider } from '../../../contexts/application.jsx';

describe('Session timer component', () => {

    it('should render with default props', () => {
        const config = {
            layout: {
                countDownForSeconds: 5,
                defaultTimeoutSeconds: 10,
                header: {
                    service: 'service name'
                }
            }
        };
        expect(
            shallow(<ApplicationProvider config={config}>
                <SessionTimer />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should render the modal when timing out', () => {
        jest.spyOn(React, 'useContext').mockReturnValue({
            layout: {
                countDownForSeconds: 5,
                defaultTimeoutSeconds: 4,
                header: {
                    service: 'service name'
                }
            }
        });

        expect(
            shallow(<SessionTimer />)
        ).toMatchSnapshot();
    });
    it('should render the modal when timed out', () => {
        jest.spyOn(React, 'useContext').mockReturnValue({
            layout: {
                countDownForSeconds: 5,
                defaultTimeoutSeconds: 0,
                header: {
                    service: 'service name'
                }
            }
        });

        expect(
            shallow(<SessionTimer />)
        ).toMatchSnapshot();
    });
});