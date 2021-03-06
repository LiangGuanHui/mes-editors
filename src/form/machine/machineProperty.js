export default function getMachinePropertyForm (form = null, type = 'add') {
  return Promise.resolve({
    title: `${type === 'add' ? '新建' : '编辑'}类别属性表单`,
    formItems: [
      {
        value: 'pptName',
        label: '属性名称',
        component: 'el-input',
        span: 22
      },
      {
        value: 'pptType',
        label: '属性类型',
        component: 'ex-select',
        options: [{value: 0, label: '一般属性'}, {value: 1, label: '匹配属性'}],
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
      kindId: 0,
      pptType: 0,
      pptName: '',
      description: ''
    }, form),
    rules: {
      pptName: [{ required: true, message: '请输入属性名称', trigger: 'blur' }],
      kindId: [{ required: true, message: '请选择设备类别', trigger: 'blur' }]
    }
  })
}
