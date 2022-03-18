//@flow
import React, { useState } from 'react';
import _l from 'lib/i18n';
import { Dropdown } from 'semantic-ui-react';
import InsightPane from '../InsightPane/InsightPane';
import AwardImage from '../AwardImage';
import css from './TopLists.css';
import { TopListsItem } from './TopListsItem'

type PropsT = {
    data: {},
};

addTranslations({
    'en-US': {
    },
});

let getName = (key)=> {
    switch (key) {
        case 'SALES':
            return _l`SALES`
        case 'PROFIT':
            return _l`PROFIT`
        case 'MARGIN':
            return _l`MARGIN`
        case 'MEDIAN_DEAL_TIME':
            return _l`DEAL TIME`
        case 'GROWTH':
            return _l`GROWTH`
        case 'SIZE':
            return _l`Size`.toUpperCase()
        case 'TYPE':
            return _l`Type`.toUpperCase()
        case 'OPPORTUNITIES':
            return _l`Deals`.toUpperCase()
        case 'MEDIAN_DEAL_SIZE':
            return _l`Deal size`.toUpperCase()
        case 'DIALS':
            return _l`Dial`.toUpperCase()
        case 'CALLS':
            return _l`Calls`.toUpperCase()
        case 'APPOINTMENTS':
            return _l`Meetings`.toUpperCase()
            //CALLS
        default:
            break;
    }
}

const getTitle= (key)=>{
    switch (key) {
        case 'ACCOUNT':
            return _l`Top companies`;
        case 'CONTACT':
            return _l`Top contacts`;
        case 'PERFORMERS':
            return _l`Top performers`;
        case 'PRODUCTS':
            return _l`Top products`
        default:
            break;
    }
}

const TopAccount = ({ data, type }: PropsT) => {

    if (!data){
        return <InsightPane minWidth={280} padded title={getTitle(type)}></InsightPane>
    }

    const [category, setCategory] = useState(data.topListDTOList.length > 0 ? data.topListDTOList[0].label : null)

    const categories = data.topListDTOList.map(value => {
        return {
            value: value.label,
            key: value.label,
            text: _l`${getName(value.label)}`
        }
    });

    let list = [];
    if(category){
        const categoryObject = data.topListDTOList.find(value => value.label === category);

        if (categoryObject){
            list = categoryObject.topDTOList;
        }
    }

    console.log('list12: ', list, category)

    return (
        <InsightPane minWidth={280} padded title={getTitle(type)}>
            <Dropdown
                fluid
                search
                value={category}
                selection
                size="small"
                onChange={(event, { value })=> {
                    setCategory(value)
                }}
                // placeholder={_l`Select contact`}
                options={categories}
            />
            {
                list.map((value, idx) => {
                    let right="";
                    if (category === "MARGIN"){
                        right = `${Number(value.value).toFixed(0)}%`
                    } else if (category === "MEDIAN_DEAL_TIME"){
                        right = `${secToDay(value.value)} ${_l`Days`}`
                    }
                    else {
                        const valueConvert = getPriceValue(value.value);
                         right = `${valueConvert.value} ${valueConvert.unitOfMea}`
                    }

                    return <TopListsItem key={idx} avatar={value.avatar} name={value.name} right={right} />
                })
            }
        </InsightPane>
    );
};

export default TopAccount;

const secToDay = (sec)=> {
    return Math.ceil(sec / (60 * 60 * 24 * 1000))
}

export const getPriceValue = (value) => {
    var roundNumber = Math.round(value);
    if (roundNumber < 1000) return { value: roundNumber, unitOfMea: '' };

    //Thousands
    if (roundNumber >= 1000 && roundNumber < 10000) {
        return { value: Math.round(roundNumber / 10) / 100, unitOfMea: 'K' };
    } else if (roundNumber >= 10000 && roundNumber < 100000) {
        return { value: Math.round(roundNumber / 100) / 10, unitOfMea: 'K' };
    } else if (roundNumber >= 100000 && roundNumber < 1000000) {
        return { value: Math.round(roundNumber / 1000), unitOfMea: 'K' };
    }

    // Millions
    else if (roundNumber >= 1000000 && roundNumber < 10000000) {
        return { value: Math.round(roundNumber / 10000) / 100, unitOfMea: 'M' };
    } else if (roundNumber >= 10000000 && roundNumber < 100000000) {
        return { value: Math.round(roundNumber / 100000) / 10, unitOfMea: 'M' };
    } else if (roundNumber >= 100000000 && roundNumber < 1000000000) {
        return { value: Math.round(roundNumber / 1000000), unitOfMea: 'M' };
    }

    //Billions
    else if (roundNumber >= 1000000000 && roundNumber < 10000000000) {
        return { value: Math.round(roundNumber / 10000000) / 100, unitOfMea: 'B' };
    } else if (roundNumber >= 10000000000 && roundNumber < 100000000000) {
        return { value: Math.round(roundNumber / 100000000) / 10, unitOfMea: 'B' };
    } else if (roundNumber >= 100000000000 && roundNumber < 1000000000000) {
        return { value: Math.round(roundNumber / 1000000000), unitOfMea: 'B' };
    }
    return 0;
}
