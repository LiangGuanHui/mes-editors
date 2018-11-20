function checkBusinessCode (rule, value, callback) {
  if (rule.type === 'edit') {
    return callback()
  }
  if (!value) {
    return callback(new Error('请选择业务'))
  }
  callback()
}

export default function getMachineAnalogPointForm (form = null, type = 'add', businessOptions, pointOptions, controlOptions) {
  return Promise.resolve({
    title: `${type === 'add' ? '新建' : '编辑'}设备过程点位表单`,
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
        disabled: true
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
        value: 'controlId',
        label: '管控项',
        component: 'ex-select',
        options: controlOptions,
        span: 12
      }
    ],
    formData: Object.assign({
      machineCode: '',
      businessCode: '01',
      businessName: '',
      runAt: 0,
      pointId: pointOptions[0] ? pointOptions[0].value : 0,
      controlId: controlOptions[0] ? controlOptions[0].value : 0
    }, form),
    rules: {
      businessCode: [{ required: true, type, validator: checkBusinessCode, trigger: 'change' }]
    }
  })
}
