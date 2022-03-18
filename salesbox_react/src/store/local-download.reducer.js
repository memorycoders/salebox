// @flow
import createReducer from 'store/createReducer';
const DownloadAction = {
    DOWNLOAD: 'DOWNLOAD',
    CLEAR_DOWNLOAD: 'CLEAR_DOWNLOAD'
}

const initialState = {
    downloadUrl: null
};

export const clearDownload = ()=> {
    return {
        type: DownloadAction.CLEAR_DOWNLOAD
    }
}

export const addDownload = (downloadUrl) => {
    return {
        type: DownloadAction.DOWNLOAD,
        downloadUrl
    }
}

export default createReducer(initialState, {

    // Feature: Others
    [DownloadAction.DOWNLOAD]: (draft, action) => {
        draft.downloadUrl = action.downloadUrl;
    },
    [DownloadAction.CLEAR_DOWNLOAD]: (draft, action) => {
        draft.downloadUrl = null;
    },
});
