import Api from '@/utils/Api'

function checkBusinessCode (rule, value, callback) {
  console.log(rule)
  if (rule.type === 'edit') {
    return callback()
  }
  if (!value) {
    return callback(new Error('请选择业务'))
  }
  const { machineCode, businessCode } = rule.form
  Api.get('MachineStandardPoints/Validate', { machineCode, businessCode }).then(valid => {
    if (valid) {
      return callback()
    } else {
      return callback(new Error('该业务已存在'))
    }
  })
}

export default function getMachineStandardPointForm (form = null, type = 'add', businessOptions, pointOptions, driveOptions) {
  const triggerType = (form && form.triggerType) ? 1 : 0
  return Promise.resolve({
    title: `${type === 'add' ? '新建' : '编辑'}设备标准点位表单`,
    formItems: [
      {
        value: 'machineCode',
        label: '设备编号',
        component: 'el-input',
        disabled: true,
        span: 24
      },
      {
        value: 'businessCode',
        label: '业务',
        component: 'ex-select',
        options: businessOptions,
        span: 12,
        disabled: type === 'edit'
      },
      {
        value: 'runAt',
        label: '运行在',
        component: 'ex-select',
        options: [{value: 0, label: '客户端'}, {value: 1, label: '服务器'}],
        span: 12
      },
      {
        value: 'pointId',
        label: '数据点',
        component: 'ex-select',
        options: pointOptions,
        span: 12
      },
      {
        value: 'taskDriveCode',
        label: '任务驱动',
        component: 'ex-select',
        options: driveOptions,
        span: 12
      },
      {
        value: 'triggerType',
        label: '触发类型',
        component: 'ex-select',
        options: [{value: 0, label: '按时间'}, {value: 1, label: '按次数'}],
        span: 12
      },
      {
        value: 'triggerCondition',
        label: '触发条件',
        component: 'ex-input-number',
        unit: ['秒', '次'][triggerType],
        span: 12
      },
      {
        value: 'parameter',
        label: '参数',
        component: 'el-input'
      }
    ],
    formData: Object.assign({
      machineCode: '',
      businessCode: '',
      businessName: '',
      runAt: 0,
      pointId: '',
      taskDriveCode: '',
      triggerType: 0,
      triggerCondition: 0,
      parameter: ''
    }, form),
    rules: {
      businessCode: [{ required: true, type, validator: checkBusinessCode, trigger: 'change' }]
    }
  })
}
