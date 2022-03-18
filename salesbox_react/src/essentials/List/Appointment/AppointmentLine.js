import React from 'react';
import css from './AppointmentItem.css'

export const AppointmentLine = ({ finished})=>{
    return <div className={css.lineContainer}>
        <div className={css.line}/>
        <div style={{ background: finished ? '#a9ce31' : '#808285'}} className={css.circle} />
        <div className={css.line} />
    </div>
}