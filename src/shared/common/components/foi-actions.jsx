import React, { Fragment, useContext } from 'react';
import { Context } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FoiActions = () => {
    const { page, summary }  = useContext(Context);
    const pitExtensionApplied = ('FOI_PIT' in summary.case.deadLineExtensions);

    return (
        <Fragment>
            <span className="govuk-body full-width"><strong>Current due date: </strong>{summary.case.deadline} {pitExtensionApplied && <span className="govuk-body">(PIT Extension Applied)</span>}</span>
            {!pitExtensionApplied &&
            <Link className='govuk-body govuk-link' to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/actions_tab/extend_foi_deadline`} >
                Extend this case</Link>}
        </Fragment>
    );
};


FoiActions.propTypes = {
    dispatch: PropTypes.func.isRequired,
    correspondents: PropTypes.array,
    page: PropTypes.object,
    summary: PropTypes.object
};

export default FoiActions;
