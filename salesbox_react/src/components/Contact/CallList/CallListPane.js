//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { branch, renderNothing, compose, pure, withHandlers } from 'recompose';
import { FormPair, Collapsible } from 'components';
import { connect } from 'react-redux';
import { highlight } from '../../Overview/overview.actions'
import './CallListPane.less';

type PropsType = {
    contact: {},
};

addTranslations({
    'en-US': {
        'Call lists': 'Call lists'
    },
});

const CallListPane = ({ contact, openDeleteCallList }: PropsType) => {
    const { callListContactDTOs } = contact;
    if (!contact || !callListContactDTOs || callListContactDTOs.length === 0){
        return null;
    }
    return (
        <Collapsible hasDragable width={308} padded title={_l`Call lists`} open={open}>
            <div className="call-list-account-container">
                {(callListContactDTOs ? callListContactDTOs : []).map(value => {
                    return <span>
                        <div className="call-list-item">
                            {value.name}
                            <span onClick={() => {
                                openDeleteCallList(value.uuid);
                            }}>×</span>
                        </div>
                    </span>
                })}
            </div>
        </Collapsible>
    );
};

export default compose(
    connect(
        null,
        {
            highlight
        }
    ),
    withHandlers({
        openDeleteCallList: ({ highlight, overviewType })=> (callListId)=>{
            highlight('CALL_LIST_CONTACT', callListId, 'delete_call_list')
        }
    }),
    pure
)(CallListPane);
