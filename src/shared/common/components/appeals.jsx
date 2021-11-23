import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../contexts/application.jsx';

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
                <p className='govuk-body'>Registered appeals:</p>
                <table className='govuk-table'>
                    { appealArray.length > 0 &&
                        appealArray.map((appeal, i)=> {
                            return (
                                <tr className='govuk-table__row' key={i}>
                                    <td key={i} className='govuk-table__cell'>
                                        { appeal.label }
                                    </td>
                                    <td key={i} className='govuk-table__cell'>
                                        { appeal.status }
                                    </td>
                                    <td key={i} className='govuk-table__cell'>
                                        <Link to={`/case/${page.params.caseId}/stage/${page.params.stageId}/caseAction/appeal/update/${appeal.id}?hideSidebar=false`}
                                            className="govuk-link">Update</Link>
                                    </td>
                                    <td key={i} className='govuk-table__cell'>
                                        <Link to={`/case/${page.params.caseId}/stage/${page.params.stageId}/caseAction/appeal/manage_documents/${appeal.id}?hideSidebar=false`}
                                            className="govuk-link">Manage Documents</Link>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </table>
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