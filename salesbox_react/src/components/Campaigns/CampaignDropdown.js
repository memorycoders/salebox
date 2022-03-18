//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as UnitActions from 'components/Unit/unit.actions';
import { getUnitsForDropdown } from 'components/Unit/unit.selector';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import type { UnitT } from 'components/Unit/unit.types';

type PropsT = {
    units: Array<UnitT>,
    isFetching: (event: Event, { searchQuery: string }) => void,
    isFetching: boolean,
};

const CampaignDropdown = ({ campaigns , ...other }: PropsT) => {
    return <Dropdown
        fluid 
        multiple
        search 
        selection 
        size="small" 
        options={campaigns} 
        {...other} 
        placeholder="" />;
};

export default CampaignDropdown;
