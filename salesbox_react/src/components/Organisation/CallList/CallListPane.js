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

const CallListPane = ({ account, openDeleteCallList }: PropsType) => {
    const { callListAccountDTOs } = account;
    if (!account || !callListAccountDTOs || callListAccountDTOs.length === 0){
        return null;
    }
    return (
        <Collapsible padded title={_l`Call lists`} open={open}>
            <div className="call-list-account-container">
                {(callListAccountDTOs ? callListAccountDTOs : []).map(value => {
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
            highlight('CALL_LIST_ACCOUNT', callListId, 'delete_call_list')
        }
    }),
    pure
)(CallListPane);
