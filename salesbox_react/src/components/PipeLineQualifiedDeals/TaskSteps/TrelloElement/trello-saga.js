//@flow
import { all, takeLatest, call, put, select, fork } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { ObjectTypes, Endpoints } from 'Constants';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import api from 'lib/apiClient';
import { ActionTypes, loadMoreStepsSuccess } from './trello-action';
import generateUuid from 'uuid/v4';

addTranslations({
    'en-US': {
        Added: 'Added',
        'Cannot add order without products': 'Cannot add order without products',
    },
});

const timezone = new Date().getTimezoneOffset() / -60;

export function* loadMoreSteps({ columnId, pageIndex, lastStep, salesProcessId }): Generator<*, *, *> {
    const state = yield select();
    const search = getSearch(state, ObjectTypes.PipelineQualified);
    const period = getPeriod(state, ObjectTypes.PipelineQualified);
    const { searchFieldDTOList } = getSearchForSave(state, ObjectTypes.PipelineQualified);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let ownerId = state.ui.app.activeRole;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !ownerId) {
        ownerId = state.auth.userId;
    } else if (roleType === 'Company') {
        ownerId = undefined;
    }
    if (roleType === 'Person' && !roleValue) {
        roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
        roleValue = undefined;
    }

    const filterDTO = {
        startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
        isFilterAll,
        roleFilterType: roleType,
        roleFilterValue: roleValue,
        customFilter: search.filter ? search.filter : 'active',
        orderBy: 'contractDate', //search.orderBy ? search.orderBy :
        isRequiredOwner: false,
        ftsTerms: search.term,
        searchFieldDTOList: search.shown ? searchFieldDTOList : [],
        isShowHistory: search.history,
        isDeleted: false,
    };
    try {

        const result = yield call(api.post, {
            resource: `${Endpoints.Prospect}/getQualifiedByStepES`,
            query: {
                lastStep,
                pageIndex: pageIndex,
                pageSize: 24,
                stepId: columnId,
                timeZone: timezone,
                sessionKey: generateUuid(),
                salesProcessId,
            },
            data: {
                ...filterDTO,
            },
        });
        const { prospectDTOList } = result;
        yield put(loadMoreStepsSuccess(prospectDTOList, salesProcessId, columnId));
    } catch (e) {
        console.log(e);
    }
}


export default function* saga() {
    yield takeLatest(ActionTypes.LOAD_MORE_STEPS, loadMoreSteps);

}
