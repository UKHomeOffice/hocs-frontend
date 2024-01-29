import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';

const Appeals = (props) => {
    const { page } = useContext(Context);
    const { APPEAL } = props.props;

    const getCurrentAppeals = (APPEAL) => {

        const currentAppealTypeList = APPEAL.filter(appeal => appeal.typeData.length > 0).map(appeal => {
            return {
                label: appeal.typeInfo.actionLabel,
                appealsOfType: [ ...appeal.typeData ]
            };
        });

        const appealArray = [];

        for (let typeData of currentAppealTypeList) {

            typeData.appealsOfType.map(appealData => {
                return appealArray.push({
                    id: appealData.uuid,
                    label: typeData.label,
                    status: appealData.status
                });
            });
        }

        if (appealArray.length < 1) {
            return (
                <>
                </>
            );
        }

        return (
            <>
                <dl className="govuk-summary-list">
                    { appealArray.length > 0 &&
                        appealArray.map((appeal, i)=> {
                            return (
                                <div className="govuk-summary-list__row" key={i}>
                                    <dt key={i} className="govuk-summary-list__key">
                                        { appeal.label }
                                    </dt>
                                    <dt key={i} className="govuk-summary-list__value">
                                        { appeal.status }
                                    </dt>
                                    <dt key={i} className='govuk-summary-list__actions'>
                                        <Link to={`/case/${page.params.caseId}/stage/${page.params.stageId}/caseAction/appeal/update/${appeal.id}?hideSidebar=false`}
                                            className="govuk-link">Update</Link>
                                    </dt>
                                </div>
                            );
                        })
                    }
                </dl>
            </>
        );
    };

    return (
        <>
            <h3 className="govuk-heading-s">Appeals</h3>
            { getCurrentAppeals(APPEAL) }
            <p className='govuk-body'>Record an appeal against this request:</p>

            <Link className='govuk-body govuk-link' to={`/case/${page.params.caseId}/stage/${page.params.stageId}/caseAction/appeal/add`}>
                        Add an appeal
            </Link>
        </>
    );
};

export default Appeals;

Appeals.propTypes = {
    APPEAL: PropTypes.object,
    props: PropTypes.object,
};
