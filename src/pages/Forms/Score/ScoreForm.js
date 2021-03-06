import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Popover,
} from 'antd';

import { connect } from 'dva';
import styles from '../style.less';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from './ScoreTableForm';

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
class RecordForm extends PureComponent {
  state = {
    width: '100%',
    data: [],
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width } = this.state;

    return (
      <PageHeaderWrapper
        title="成绩信息"
        content="天津大学本科生成绩信息"
        wrapperClassName={styles.advancedForm}
      >

        <Card title="成员管理" bordered={false}>
          {getFieldDecorator('members', {
            initialValue: this.state.data,
          })(<TableForm />)}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RecordForm;
