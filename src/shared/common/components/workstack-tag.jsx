import React from 'react';
import PropTypes from 'prop-types';

export default function Tags(props) {
    let tags = [];

    if (props.row.tag && props.row.tag.length > 0) {
        tags = props.row.tag.map(tag => {
            return <span key={tag} className="govuk-tag govuk-!-margin-right-1">{tag}</span>;
        });
    }

    return tags;
}

Tags.propTypes = {
    row: PropTypes.object,
    tag: PropTypes.array
};

