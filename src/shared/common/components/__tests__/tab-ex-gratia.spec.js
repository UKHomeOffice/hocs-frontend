import React from 'react';
import TabExGratia from '../tab-ex-gratia';
import { ApplicationProvider } from '../../../contexts/application.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

/* eslint-disable react/display-name*/
jest.mock('../../forms/form-repository.jsx', () => {
    return {
        formComponentFactory: (field, { key }) => {
            return(
                <div id={field} key={key} />
            );
        }
    };
});
/* eslint-enable react/display-name*/

describe('Ex-Gratia tab component', () => {

    const page = {},
        stages = [{ type: 'test' }];

    const config = {
        page: {
            params: {
                caseId: 'some_uuid'
            }
        },
        caseData: {
            PaymentTypeConsolatory: 'Yes',
            PaymentTypeExGratia: 'No',
            AmountComplainantRequested: 100,
            ConsolatoryOfferSentToComplainant: 50,
            ExGratiaOfferSentToComplainant: 50,
            TotalOfferSentToComplainant: 100,
        }
    };

    it('should render with default props', () => {
        const wrapper = render(
            <ApplicationProvider config={config}>
                <TabExGratia
                    page={page}
                    stages={stages}
                />
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
    });

    it('should render with content when passed', () => {
        expect(
            render(<ApplicationProvider config={config}>
                <TabExGratia
                    page={page}
                    stages={stages}
                />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should render form when passed', () => {
        expect(
            render(<ApplicationProvider config={config}>
                <TabExGratia
                    page={page}
                    stages={stages}
                />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should render EX_GRATIA_TAB, when has empty stages', () => {

        const emptyStages = [];

        expect(
            render(<ApplicationProvider config={config}>
                <TabExGratia
                    page={page}
                    stages={emptyStages}
                />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should not render empty fields when passed', () => {
        const config = {
            page: {
                params: {
                    caseId: 'some_uuid'
                }
            },
            caseData: {
                PaymentTypeConsolatory: 'Yes'
            }
        };

        expect(
            render(<ApplicationProvider config={config}>
                <TabExGratia
                    page={page}
                    stages={stages}
                />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });
});
