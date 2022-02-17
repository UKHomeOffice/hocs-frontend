import React, { useContext } from 'react';
import { Context } from '../../contexts/application.jsx';
import { Link } from 'react-router-dom';
import { isDateTodayOrAfter } from '../../helpers/date-helpers';

const Extensions = (props) => {
    const { currentDeadline, EXTENSION } = props.props;
    const { page } = useContext(Context);

    const hasApplicableExtensions = (extensionArray) => {
        return extensionArray
            .filter(extensionType => extensionType.typeData.length < extensionType.typeInfo.maxConcurrentEvents)
            .length > 0;
    };

    const deadlineIsTodayOrAfter = (currentDeadline) => {
        return isDateTodayOrAfter(currentDeadline);
    };

    const shouldAllowAddExtension = (extensionArray) => {
        return hasApplicableExtensions(extensionArray)
            && deadlineIsTodayOrAfter(currentDeadline.split('/').reverse().join('-'));
    };

    const getExtensionLabel = (extensionsArray) => {
        let extensionLabel = [];

        extensionsArray.forEach(ext => {
            if (ext.typeData.length > 0) {
                extensionLabel.push(ext.typeInfo.actionLabel);
            }
        });
        return  extensionLabel.length > 0 ? '(' + extensionLabel.join() + ' applied)' : undefined;
    };

    return (
        <>
            <h2 className="govuk-heading-s">Extensions</h2>
            <span className="govuk-body full-width"> Current due date: { currentDeadline } { getExtensionLabel(EXTENSION) }</span>

            { shouldAllowAddExtension(EXTENSION) &&
                <>
                    <span className="govuk-body full-width">Apply an extension to this case.</span>
                    <Link className='govuk-body govuk-link' to={ `/case/${page.params.caseId}/stage/${page.params.stageId}/caseAction/extension/add` }>Extend this case</Link>
                </>
            }
            { !shouldAllowAddExtension(EXTENSION) && <span className="govuk-body full-width">No further extensions can be applied to this case.</span> }
        </>
    );
};

export default Extensions;