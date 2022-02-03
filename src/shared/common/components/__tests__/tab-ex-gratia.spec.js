import React from 'react';
import TabExGratia from '../tab-ex-gratia';
import { ApplicationProvider } from '../../../contexts/application.jsx';

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

describe('Form component', () => {

    const correspondents = [],
        page = {},
        summary = {};

    const config = {
        caseData: {
            PaymentTypeConsolatory: true,
            PaymentTypeExGratia: true,
            AmountComplainantRequested: 100,
            AmountBusinessRequested: 50,
            ConsolatoryOfferSentToComplainant: 50,
            ExGratiaOfferSentToComplainant: 50,
            TotalOfferSentToComplainant: 100,
            ComplainantAccepted: false
        }
    };

    it('should render with default props', () => {
        const wrapper = render(
            <ApplicationProvider config={config}>
                <TabExGratia
                    correspondents={correspondents}
                    page={page}
                    summary={summary}
                />
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
    });

    it('should render with content when passed', () => {
        expect(
            render(<ApplicationProvider config={config}>
                <TabExGratia
                    correspondents={correspondents}
                    page={page}
                    summary={summary}
                />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should render form when passed', () => {
        expect(
            render(<ApplicationProvider config={config}>
                <TabExGratia
                    correspondents={correspondents}
                    page={page}
                    summary={summary}
                />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should not render empty fields when passed', () => {
        const config = {
            caseData: {
                PaymentTypeConsolatory: true,
                PaymentTypeExGratia: true,
                BusinessApprovedPayment: false,
                ComplainantAccepted: false
            }
        };

        expect(
            render(<ApplicationProvider config={config}>
                <TabExGratia
                    correspondents={correspondents}
                    page={page}
                    summary={summary}
                />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });
});
