import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  message
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const success = ()=>{
  message.success("添加成功！")
}
const error = ()=>{
  message.error("添加失败！")
}
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    //在这里添加
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log(values);
        fetch("http://localhost:8080/api/insert/student",{
          method:"POST",
          headers:{
            'content-type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        .then(res=>res.json())
        .then(data=>{
          success()
          
        })
        .error(
          error()
        )

      }
    });
  };
  handleRefresh=()=>{
    const { form } = this.props;
    form.setFieldsValue({
      "sname":null,
      "student_id":null,
      "gender":null,
      "adm_age":null,
      "adm_year":null
    })
  }
  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.forms.basic.title" />}
        content={<FormattedMessage id="app.forms.basic.description" />}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="姓名" />}>
              {getFieldDecorator('sname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: '请输入学生的姓名' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: '请输入学生的姓名' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="学号" />}>
              {getFieldDecorator('student_id', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: '请输入学生的学号' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: '请输入学生的学号' })} />)}
            </FormItem>
            

            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="性别" />}
            >
              <div>
                {getFieldDecorator('gender', {
                  initialValue: '男',
                })(
                  <Radio.Group>
                    <Radio value={'男'}>
                      <FormattedMessage id="男" />
                    </Radio>
                    <Radio value={'女'}>
                      <FormattedMessage id="女" />
                    </Radio>
                  </Radio.Group>
                )}
              </div>
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="入学年龄" />}>
              {getFieldDecorator('adm_age', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: '请输入学生的入学年龄' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: '请输入学生的入学年龄' })} />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<FormattedMessage id="入学年份" />}>
              {getFieldDecorator('adm_year', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: '请输入学生的入学年份' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: '请输入学生的入学年份' })} />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={
                <span>
                  <FormattedMessage id="班级" />
                  <em className={styles.optional}>
                    <FormattedMessage id="form.optional" />
                    <Tooltip title={<FormattedMessage id="form.client.label.tooltip" />}>
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
               {getFieldDecorator('classroom')(<Input placeholder={formatMessage({ id: '请输入学生分配的班级' })} />)}
            </FormItem>
            
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleRefresh} >
                <FormattedMessage id="重置" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
