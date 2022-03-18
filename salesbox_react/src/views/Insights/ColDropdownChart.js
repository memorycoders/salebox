import React from 'react';
import { lifecycle, compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import { Menu, Popup, Icon } from 'semantic-ui-react';
import * as DashboardActions from 'components/Dashboard/dashboard.actions';
import css from './Insight.css'
import add from '../../../public/Add.svg';
import { IconButton } from '../../components/Common/IconButton';
import { highlight } from '../../components/Overview/overview.actions';

const style={
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11
}

const ColdropdownChart = ({ columns, enableFullscreen, setOneCol,
    setTwoCol,
    setThreeCol,
    highlight
})=>{
    return <Menu.Menu position="right" size="small">
        <Menu.Item>
            <Popup
            style={{ fontSize: 11}}
            trigger={<div className={css.fullscreenIcon}>
                <Icon style={{ ...style, fontSize: 18, color: 'rgb(128,128,128)' }} onClick={enableFullscreen} name="expand" />
            </div>} content={_l`Full screen play mode`}>

            </Popup>
            
            {/* <Button style={style} icon="expand" onClick={enableFullscreen} /> */}
        </Menu.Item>
        <Menu.Item>
            <div className={css.buttonGroup}>
                <div className={`${css.colButton} ${columns === 1 && css.buttonActive}`} style={style} onClick={setOneCol}>
                    {_l`1-col`}
              </div>
                <div className={`${css.colButton} ${columns === 2 && css.buttonActive}`}  style={style} active={columns === 2} onClick={setTwoCol}>
                    {_l`2-col`}
              </div>
                <div className={`${css.colButton} ${columns === 3 && css.buttonActive}`}  style={style} active={columns === 3} onClick={setThreeCol}>
                    {_l`3-col`}
              </div>
                <IconButton onClick={()=> {
                    highlight('INSIGHT_CREATE_MODAL',null, 'create')
                }} name="profile" size={36} src={add} />
            </div>
        </Menu.Item>
    </Menu.Menu>
}

const mapDispatchToProps = {
    requestFetchData: DashboardActions.requestFetchData,
    setColumns: DashboardActions.setColumns,
    enableFullscreen: DashboardActions.enableFullscreen,
    setFullscreen: DashboardActions.setFullscreen,
    highlight
};

const mapStateToProps = (state) => {
    const { dashboard } = state;
    return {
        fullscreen: dashboard.fullscreen,
        loading: dashboard.loading,
        items: dashboard.items,
        columns: dashboard.columns,
        currentItem: dashboard.items[dashboard.currentItem],
    };
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),

    withHandlers({
        setOneCol: ({ setColumns }) => () => setColumns(1),
        setTwoCol: ({ setColumns }) => () => setColumns(2),
        setThreeCol: ({ setColumns }) => () => setColumns(3),
    }),
)(ColdropdownChart);