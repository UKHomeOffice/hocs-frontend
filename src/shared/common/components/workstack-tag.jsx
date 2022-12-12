import React from 'react';
import PropTypes from 'prop-types';

const { fetchTagType } = require('../../../../server/config/tagType/tagType');

export default function Tags(props) {
    let tags = props.tags.map(tag => {
        let tagDetails = fetchTagType(tag);

        return <span key={tag} className={tagDetails?.displayClass ?? 'govuk-tag govuk-!-margin-right-1'}>{tagDetails?.label ?? tag}</span>;
    });

    return tags;
}

Tags.propTypes = {
    tags: PropTypes.array
};

Tags.defaultProps = {
    tags: []
};
