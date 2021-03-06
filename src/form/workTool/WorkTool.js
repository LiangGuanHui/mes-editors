import Api from '@/utils/Api'

function checkWorkToolCode (rule, value, callback) {
  if (!value) {
    return callback(new Error('工装编号不能为空'))
  }
  if (rule.type === 'edit') {
    return callback()
  }
  Api.get('WorkTools/Validate', { workToolCode: value }).then(valid => {
    if (valid) {
      callback()
    } else {
      callback(new Error('工装编号已存在'))
    }
  })
}

export default function getWorkToolForm (form = null, type = 'add') {
  if (!(form && form.modelCode)) {
    throw new Error('缺少modelCode字段')
  }
  return Promise.resolve({
    title: `${type === 'add' ? '新建' : '编辑'}型号${form.modelCode}的工装`,
    formItems: [
      {
        value: 'workToolCode',
        label: '工装编号',
        component: 'el-input',
        span: 12,
        disabled: type === 'edit'
      },
      {
        value: 'workToolName',
        label: '工装名称',
        component: 'el-input',
        span: 12
      },
      {
        value: 'supplier',
        label: '供应商',
        component: 'el-input',
        span: 12
      },
      {
        value: 'state',
        label: '状态',
        component: 'ex-select',
        options: [
          {value: -1, label: '报废'},
          {value: 0, label: '禁用'},
          {value: 1, label: '启用'},
          {value: 2, label: '已使用'},
          {value: 3, label: '保养'},
          {value: 4, label: '维修'}
        ],
        span: 12
      },
      {
        value: 'storageRoom',
        label: '库房',
        component: 'el-input',
        span: 12
      },
      {
        value: 'storePlace',
        label: '存放位置',
        component: 'el-input',
        span: 12
      },
      {
        value: 'usePlace',
        label: '使用位置',
        component: 'el-input',
        span: 12
      },
      {
        value: 'description',
        label: '说明',
        component: 'el-input',
        span: 12
      }
    ],
    formData: Object.assign({
      workToolCode: '',
      workToolName: '',
      state: 0,
      supplier: '',
      storageRoom: '',
      storePlace: '',
      usePlace: '',
      description: ''
    }, form),
    rules: {
      workToolCode: [{ required: true, type, validator: checkWorkToolCode, trigger: 'blur' }],
      workToolName: [{ required: true, message: '请输入工装名称', trigger: 'blur' }]
    }
  })
}
