import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as baseActions from 'store/modules/base';
import * as jobActions from 'store/modules/job';
import * as scheduleListActions from 'store/modules/list';
import DeleteJobModal from "components/modal/DeleteJobModal";
import {DELAY_TIME_FOR_MESSAGE} from "../../constants";


class DeleteJobModalContainer extends Component {
    handleCancel = () => {
        const {BaseActions} = this.props;
        BaseActions.hideModal('deleteJob');
    };

    showNotification = () => {
        const {BaseActions} = this.props;
        BaseActions.showNotification();
        window.setTimeout(() => {
            BaseActions.hideNotification();
            BaseActions.updateNotificationMessage({message: ''});
        }, DELAY_TIME_FOR_MESSAGE);
    };

    handleConfirm = async () => {
        const {BaseActions, JobActions, ScheduleListActions, jobName, groupName} = this.props;

        try {
            // 삭제 후, 모달 닫고 홈페이지로 이동
            await JobActions.deleteJob({jobName, groupName});
            BaseActions.updateNotificationMessage({message: `${jobName}-${groupName} : 삭제 성공하였습니다.`});
        } catch (error) {
            let responseMsg = JSON.parse(error.request.response);
            BaseActions.updateNotificationMessage({message: `${jobName}-${groupName} - ${responseMsg.message} : 삭제 실패하였습니다.`});
            console.error('error occurred while deleting the job - ', responseMsg.message, error);
        }

        BaseActions.hideModal('deleteJob');
        this.showNotification();

        try {
            const response = await ScheduleListActions.getScheduleInfo();
            console.log('deleteJob :: response', response);
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        const {visible} = this.props;
        const {handleCancel, handleConfirm} = this;
        return (
            <DeleteJobModal
                visible={visible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        );
    }
}

export default connect(
    (state) => ({
        visible: state.base.getIn(['modal', 'deleteJob']),
        jobName: state.base.getIn(['deleteJobModal', 'jobName']),
        groupName: state.base.getIn(['deleteJobModal', 'groupName'])
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
        JobActions: bindActionCreators(jobActions, dispatch),
        ScheduleListActions: bindActionCreators(scheduleListActions, dispatch)
    })
)(DeleteJobModalContainer);
