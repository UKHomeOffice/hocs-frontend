import React from 'react';

export default function SkipLink() {

    const handleSkipLinkClick = (event, target) => {
        event.preventDefault();

        // eslint-disable-next-line no-undef
        const targetElement = document.getElementById(target);
        if (targetElement) {
            targetElement.scrollIntoView();
            targetElement.focus();
        }
    };

    return (
        <a className='govuk-skip-link'
            data-module='govuk-skip-link'
            href="#main-content"
            onClick={(event) => handleSkipLinkClick(event, 'main-content')}>Skip to main content</a>
    );


}
