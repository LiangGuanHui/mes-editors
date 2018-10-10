<template>
  <el-card :style="{ height }" :body-style="{ padding: '10px' }">
    <div slot="header" class="clearfix">
      <span class="card-header--text">属性明细</span>
    </div>

    <div class="common-parameter">
      <h3>普通参数</h3>
      <ul>
        <li v-for="p in commonPropList" :key="p.ppt_id" class="prop-item" :class="{ disable: !p.enable }">
          <span class="label">{{p.ppt_name}}： </span>
          <span class="value">{{p.ppt_val}}</span>
          <el-button class="fl-r edit-btn" type="text" @click="addOrEdit(p)">编辑</el-button>
        </li>
      </ul>
    </div>

    <div class="matching-parameter">
      <h3>匹配参数</h3>
      <ul>
        <li v-for="p in matchPropList" :key="p.ppt_id" class="prop-item" :class="{ disable: !p.enable }">
          <span class="label">{{p.ppt_name}}： </span>
          <span class="value" v-if="p.ppt_condition === 'between'">{{ `${p.ppt_min} ~ ${p.ppt_max}` }}</span>
          <span class="value" v-else>{{ `${p.ppt_condition || ''} ${p.ppt_val || ''}` }}</span>
          <el-button class="fl-r edit-btn" type="text" @click="addOrEdit(p)">编辑</el-button>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script>
import apis from '@/apis'
import getForm from '@/form'

export default {
  name: 'ExPropsCard',
  props: {
    height: {
      type: String,
      default: '100%'
    },
    model: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      propertyList: []
    }
  },
  computed: {
    commonPropList () {
      return this.propertyList.filter(p => p.ppt_type === 0)
    },
    matchPropList () {
      return this.propertyList.filter(p => p.ppt_type === 1)
    }
  },
  watch: {
    code (value) {
      this.propertyList = []
      if (value) {
        apis[`fetchPropertyListBy${this.model}Code`](value).then(data => {
          this.propertyList = data
        })
      }
    }
  },
  methods: {
    addOrEdit (prop) {
      if (prop.ppt_val || prop.ppt_condition) {
        this._editProperty(prop)
      } else {
        this._addProperty(prop)
      }
    },

    _addProperty (prop) {
      getForm[`${this.model}PropertyDetail`](prop, 'add')
        .then(form => this.$showForm(form).$on('submit', (formData, close) => {
          apis[`add${this.model}PropertyDetail`](formData).then(propertyDetail => {
            this._updateProperty(propertyDetail)
            this.$emit('change', propertyDetail)
            this.$message.success('添加成功')
            close()
          })
        }).$on('update:ppt_condition', this._handleConditionChange))
    },

    _editProperty (prop) {
      getForm[`${this.model}PropertyDetail`](prop, 'edit')
        .then(form => this.$showForm(form).$on('submit', (formData, close) => {
          apis[`update${this.model}PropertyDetail`](formData).then(propertyDetail => {
            this._updateProperty(propertyDetail)
            this.$emit('change', propertyDetail)
            this.$message.success('修改成功')
            close()
          })
        }).$on('update:ppt_condition', this._handleConditionChange))
    },

    _updateProperty (prop) {
      const index = this.propertyList.findIndex(p => p.ppt_id === prop.ppt_id)
      if (~index) {
        this.$set(this.propertyList[index], 'id', prop.id)
        this.$set(this.propertyList[index], 'ppt_condition', prop.ppt_condition)
        this.$set(this.propertyList[index], 'ppt_val', prop.ppt_val)
        this.$set(this.propertyList[index], 'ppt_max', prop.ppt_max)
        this.$set(this.propertyList[index], 'ppt_min', prop.ppt_min)
        this.$set(this.propertyList[index], 'enable', prop.enable)
      }
    },

    _handleConditionChange (pptCondition, item, formItems, rules) {
      formItems[3].disabled = pptCondition === 'between'
      formItems[4].disabled = pptCondition !== 'between'
      formItems[5].disabled = pptCondition !== 'between'
      if (pptCondition === 'between') {
        this.$set(rules, 'ppt_val', [{ required: false }])
        this.$set(rules, 'ppt_min', [{ required: true, trigger: 'blur' }])
        this.$set(rules, 'ppt_max', [{ required: true, trigger: 'blur' }])
      } else {
        this.$set(rules, 'ppt_val', [{ required: true, pattern: /^\d+(\.\d+)?$/, transform: value => value && value.trim(), message: '请输入数字', trigger: 'blur' }])
        this.$set(rules, 'ppt_min', [{ required: false }])
        this.$set(rules, 'ppt_max', [{ required: false }])
      }
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 20px;
}
.common-parameter,
.matching-parameter {
  position: relative;
  min-height: 50px;
  border: 1px solid;
}

.common-parameter > h3,
.matching-parameter > h3 {
  position: absolute;
  top: -10px;
  right: 10px;
  margin: 0;
  padding: 0 5px;
  font-size: 14px;
  background-color: #fff;
}

.common-parameter {
  margin-top: 10px;
  color: #67c23a;
}

.matching-parameter {
  margin-top: 20px;
  color: #f56c6c;
}

.prop-item {
  position: relative;
  margin: 5px 0;
  color: #409eff;
}
.prop-item > .edit-btn {
  position: absolute;
  right: 10px;
  line-height: 21px;
}
.prop-item > .edit-btn:hover {
  color: #f56c6c;
}

.disable {
  color: #606266;
}
.prop-item > .label,
.prop-item > .value {
  display: inline-block;
}

.prop-item > .label {
  min-width: 60px;
  text-align: right;
}

.prop-item > .value {
  min-width: 50px;
  padding-left: 10px;
  padding-right: 10px;
  border-bottom: 1px solid #333;
}
</style>