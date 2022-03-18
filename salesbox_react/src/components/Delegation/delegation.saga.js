//@flow
import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { taskSchema } from '../Task/task.schema';
import { leadSchema } from '../Lead/lead.schema';
import { normalize, schema } from 'normalizr';
import DelegationActions from './delegation.actions';
import { updateTaskDetail } from '../Task/task.actions';
import { Endpoints } from 'Constants';
import * as OverviewActions from 'components/Overview/overview.actions';
import * as NotificationActions from 'components/Notification/notification.actions';
import _l from 'lib/i18n';

addTranslations({
  'en-US': {
    'Updated': 'Updated',
  },
});

function* fetchTask({ taskId }: FetchTaskT): Generator<*, *, *> {
  const state = yield select();
  try {
    const lastFetch = state.ui.delegation.lastFetch[taskId] || 0;
    if (lastFetch < Date.now() - 1000) {
      const [lead, task] = yield all([
        call(api.get, {
          query: {
            taskId,
          },
          resource: `${Endpoints.Lead}/getLeadOnTask`,
          schema: leadSchema,
        }),
        call(api.get, {
          resource: `${Endpoints.Task}/getDetails/${taskId}`,
        }),
      ]);
      let taskEntities = normalize(task, taskSchema);
      taskEntities.entities.task[taskEntities.result].leadId = lead.result;

      yield put(updateTaskDetail(task))
      yield put({ type: DelegationActions.FETCH_TASK, taskId, entities: { ...taskEntities.entities, ...lead.entities } });
    }
  } catch (e) {
    yield put({ type: DelegationActions.FETCH_LEAD_FOR_TASK_FAIL, taskId, message: e.message });
  }
}

export function* assignTask({ overviewType, data, taskId }): Generator<*, *, *> {
  try {
    const res = yield call(api.post, {
      resource: `task-v3.0/assign/${taskId}`,
      data: {
        ...data,
      },
    });
    if (res === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, taskId));
      yield put(NotificationActions.success( _l`Updated`, '', 2000));
      yield put(OverviewActions.requestFetch(overviewType, true));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if( e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(DelegationActions.FETCH_TASK_REQUEST, fetchTask);
  yield takeLatest(DelegationActions.ASSIGN_TASK, assignTask);
}
