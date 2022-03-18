//@flow
import { call, put, select, takeLatest } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { categoryList } from './category.schema';
import CategoryActions from './category.actions';
import OverviewActions from './../Overview/overview.actions';
import * as TaskActions from './../Task/task.actions';
import * as NotificationActions from 'components/Notification/notification.actions';
import _l from 'lib/i18n';

const taskEndPoints = 'task-v3.0';
const categoryEndPoints = 'administration-v3.0';
addTranslations({
  'en-US': {
    Added: 'Added',
    'Category already exist': 'Category already exist',
  },
});
function* fetchDropdown(): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${taskEndPoints}/list/category`,
      schema: categoryList,
    });
    yield put({ type: CategoryActions.FETCH_DROPDOWN, ...data });
    // }
  } catch (e) {
    yield put({ type: CategoryActions.FETCH_DROPDOWN_FAIL, message: e.message });
  }
}

function* saveCategory({ token, enterpriseID, name }): Generator<*, *, *> {
  try {
    const data = yield call(api.post, {
      resource: `${categoryEndPoints}/workData/activity/add`,
      data: {
        description: null,
        discProfile: 'NONE',
        name: name,
        type: 'CATEGORY',
      },
      query: {
        token: token,
        enterpriseID: enterpriseID,
      },
    });

    if (data) {
      yield put(NotificationActions.success(_l`Added`, '', 2000));
      yield put({ type: CategoryActions.FETCH_DROPDOWN_REQUEST });
      let dataCategory = {
        categoryId: data.uuid,
        // formKey: '__EDIT',
      };
      yield put(TaskActions.createEntity('__CREATE', dataCategory));
      yield put(TaskActions.createEntity('__EDIT', dataCategory));
    }

    // fetch new data in dropdown
    // const newData = yield call(api.get, {
    //   resource: `${taskEndPoints}/list/category`,
    //   schema: categoryList,
    // });
    // yield put({ type: CategoryActions.FETCH_DROPDOWN, ...newData });
  } catch (e) {
 
    if (e.message === 'WORK_DATA_ACTIVITY_NAME_UNIQUE') {
      yield put(NotificationActions.error(_l`Category already exist`, 'error'));
    }
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(CategoryActions.FETCH_DROPDOWN_REQUEST, fetchDropdown);
  yield takeLatest(CategoryActions.SAVE_CATEGORY, saveCategory);
}
