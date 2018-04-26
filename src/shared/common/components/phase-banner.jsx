import React, {Component} from "react";

export default class PhaseBannerComponent extends Component {
    render() {
        const {phase, feedback} = this.props;

        return (
            <div className="phase-banner">
                <p>
                    <strong className="phase-tag">{phase}</strong>
                    <span>This is a new service – your <a
                        href={feedback}>feedback</a> will help us to improve it.</span>
                </p>
            </div>
        )
    }
}