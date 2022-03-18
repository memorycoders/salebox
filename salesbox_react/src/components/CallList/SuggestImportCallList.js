import * as React from 'react';
import _l from 'lib/i18n';
import ModalCommon from "../ModalCommon/ModalCommon"
import { compose, withHandlers, withState } from "recompose"
import { connect } from "react-redux"
import Class from './CallList.css'
import { updateSuggestCallList, updateImportStatusInCallList } from './callList.actions';
type Props= {
    suggestForm: {
        status: Boolean,
        type: String
    },
    handlerClose: void
}
addTranslations({
    'en-US': {
        '{0}': '{0}',
      'Notification': 'Notification',
      'Name is required': 'Name is required',
      'Later': 'Later',
      'Import': 'Import',
      'You can now add {0} to your new call list': 'You can now add {0} to your new call list'
    },
});

const HandlerRender = (isImportStatus, suggestForm) => {
    if(isImportStatus) {
        return (
            <>
                <div className={Class.CL_Import}>
                    <div className={Class.CL_Area_Import}>
                    <form method="post" action="" enctype="multipart/form-data">
                        <div>
                            <input hidden type="file" name="files[]" id="file" data-multiple-caption="{count} files selected" multiple />
                            <label for="file"><strong>{_l`Choose a file .CSV`}</strong>
                              <span> {_l`or drag it here`}</span>.</label>
                        </div>
                    </form>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
            <div className={Class.SuggestText}>{_l`You can now add ${suggestForm.type} to your new call list`}</div>
            </>
        )
    }
}

const SuggestImportCallList = ({suggestForm, handlerClose, isImportStatus, handlerOk} :Props) => {
    return (
        <ModalCommon visible={suggestForm.status} size="tiny" title={isImportStatus ? _l`Import` :_l`Notification`}
        cancelLabel={_l`Later`} okLabel={_l`Import`} onClose={handlerClose} onDone={handlerOk}>
            {HandlerRender(isImportStatus, suggestForm)}
        </ModalCommon>
    )
}

const mapStateToProps = (state) => {
    return {
        suggestForm: state.entities.callList.suggestForm,
        isImportStatus: state.entities.callList.isImportStatus
    }
}
const mapDispatchToProps = {
    updateSuggestCallList: updateSuggestCallList,
    updateImportStatusInCallList: updateImportStatusInCallList
}
export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withHandlers({
        handlerClose:({updateSuggestCallList, suggestForm}) => {
            updateSuggestCallList({
                ...suggestForm,
                status: false
            })
        },
        handlerOk: ({updateImportStatusInCallList}) => {
            updateImportStatusInCallList(true)
        }
    })
)(SuggestImportCallList)
