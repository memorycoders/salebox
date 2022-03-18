import React, { Component } from 'react';
import css from './Thermometer.css';

export class ThermometerIcon extends Component {
    render() {
        const { degree, small } = this.props;
        let percent = 0;
        if (degree <= 20) {
            percent = 0;
        } else if (degree > 20 && degree <= 40) {
            percent = 30;
        } else if (degree > 40 && degree <= 60) {
            percent = 50;
        } else if (degree > 60 && degree <= 80) {
            percent = 80;
        } else {
            percent = 100;
        }

        if(small){
            return <div className={css.thermometerContainerSmall}>
                <div className={css.lineThermometerSmall}>
                    <div style={{ height: `${percent}%` }} className={css.lineProgressThermometerSmall} />
                </div>
                <span className={css.circleThermometerSmall} />
            </div>
        }

        return <div className={css.thermometerContainer}>
            <div className={css.lineThermometer}>
                <div style={{ height: `${percent}%`}} className={css.lineProgressThermometer}/>
            </div>
            <span className={css.circleThermometer}/>
        </div>
    }
}
