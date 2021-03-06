export default function getWorkToolKindForm (form = null, type = 'add') {
  if (!(form && form.typeId)) {
    throw new Error('缺少typeId字段')
  }
  return Promise.resolve({
    title: `${type === 'add' ? '新建' : '编辑'}工装类别表单`,
    formItems: [
      {
        value: 'kindName',
        label: '类别名称',
        component: 'el-input',
        span: 22
      },
      {
        value: 'description',
        label: '描述',
        component: 'el-input',
        span: 22
      }
    ],
    formData: Object.assign({
      kindName: '',
      description: ''
    }, form),
    rules: {
      kindName: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
      typeId: [{ required: true, message: '请选择工装类型', trigger: 'blur' }]
    }
  })
}
