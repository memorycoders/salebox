import React from 'react';
import CompetencePane from './CompetencePane';
const RightContent = (props) => {
    return (
        <div style={{
            padding: "10px"
        }}>
            <CompetencePane {...props}/>
        </div>
    )
}

export default RightContent;