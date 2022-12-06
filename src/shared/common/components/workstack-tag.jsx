import React from 'react';
import PropTypes from 'prop-types';
const { fetchTagType } = require('../../../../server/config/tagType/tagType');

export default function Tags(props) {
    let tags = [];

    if (props.row.tag && props.row.tag.length > 0) {
        tags = props.row.tag.map(tag => {
            const tagDetails = fetchTagType([tag]);
            let tagName = "DEFAULT";
            let tagLabel= "govuk-tag govuk-!-margin-right-1";

            if(tagDetails.length !=0) {
                tagName = tagDetails[0].tagName;
                tagLabel= tagDetails[0].tagLabel;
            }

            return <span key={tagName} className={tagLabel}>{tagName}</span>;
        });
    }

    return tags;
}

Tags.propTypes = {
    row: PropTypes.object,
    tag: PropTypes.array
};

