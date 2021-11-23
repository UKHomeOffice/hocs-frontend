import React, { Fragment } from 'react';
import Panel from '../forms/panel.jsx';
import BackLink from '../forms/backlink.jsx';
import PropTypes from 'prop-types';

const Confirmation = ({ children }) => (
    <Fragment>
        <Panel title='Success'>
            {children}
        </Panel >
        <BackLink />
    </Fragment>
);

Confirmation.propTypes = {
    children: PropTypes.node
};

export default Confirmation;