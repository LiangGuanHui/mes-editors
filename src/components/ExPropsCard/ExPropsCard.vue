<template>
  <el-card :style="{ height: (/(%|px)$/i.test(height)) ? height : `${height}px` }">
    <div slot="header" class="clearfix">
      <span class="card-header--text">属性明细</span>
      <el-button v-if="item.kindId" class="fl-r" type="text" size="mini" icon="el-icon-plus" @click="addKindProp">添加属性</el-button>
    </div>

    <div class="kind-parameter" v-if="item.kindId">
      <el-table :data="kindProps" stripe header-cell-class-name="thcell" size="mini" class="w100p">
        <el-table-column prop="pptType" label="属性类型" :formatter="formatter"></el-table-column>
        <el-table-column prop="pptName" label="属性名称"></el-table-column>
        <el-table-column fixed="right" label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button @click.stop="editKindProp(scope.row)" type="text" icon="el-icon-edit" circle size="mini"></el-button>
              <el-button @click.stop="deleteKindProp(scope.row.pptId)" type="text" icon="el-icon-delete" circle size="mini"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="common-parameter" v-if="propDetailVisible">
      <h3>普通参数</h3>
      <ul>
        <li v-for="p in commonPropList" :key="p.pptId" class="prop-item" :class="{ disable: !p.enable }">
          <span class="label">{{p.pptName}}： </span>
          <span class="value">{{p.pptVal}}</span>
          <el-button class="fl-r edit-btn" type="text" @click="addOrEdit(p)">编辑</el-button>
        </li>
      </ul>
    </div>

    <div class="matching-parameter" v-if="propDetailVisible">
      <h3>匹配参数</h3>
      <ul>
        <li v-for="p in matchPropList" :key="p.pptId" class="prop-item" :class="{ disable: !p.enable }">
          <span class="label">{{p.pptName}}： </span>
          <span class="value" v-if="p.pptCondition === 'between'">{{ `${p.pptMin} ~ ${p.pptMax}` }}</span>
          <span class="value" v-else>{{ `${p.pptCondition || ''} ${p.pptVal || ''}` }}</span>
          <el-button class="fl-r edit-btn" type="text" @click="addOrEdit(p)">编辑</el-button>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios'
import Api from '@/utils/Api'
import forms from '@/form'

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
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      propDetailVisible: false,
      kindProps: [],
      propertyList: []
    }
  },
  computed: {
    commonPropList () {
      return this.propertyList.filter(p => p.pptType === 0)
    },
    matchPropList () {
      return this.propertyList.filter(p => p.pptType === 1)
    },
    modelCode () {
      return `${this.type[0].toLowerCase()}${this.type.substr(1)}Code`
    }
  },
  watch: {
    item (obj, oldObj) {
      this.propDetailVisible = false
      if (!/^(Mould|WorkTool|Machine)s$/i.test(this.model)) {
        this.propertyList = []
        if (obj.kindId === oldObj.kindId) {
          return
        }
        if (obj.kindId) {
          this._fetchKindProps({kindId: obj.kindId}).then(kindProps => {
            this.kindProps = kindProps
          })
        } else {
          this.kindProps = []
        }
        return
      }
      axios.all([this._fetchKindProps({modelCode: obj.modelCode}), this._fetchPropDetails(obj[this.modelCode])])
        .then(([kindProps, propDetails]) => {
          this.kindProps = kindProps
          this.propertyList = kindProps.map(item => {
            const props = {
              pptId: item.pptId,
              pptName: item.pptName,
              pptType: item.pptType,
              pptCondition: '',
              pptVal: '',
              pptMin: 0,
              pptMax: 0,
              enable: 1
            }
            props[this.modelCode] = this.item[this.modelCode]
            const propDetail = propDetails.find(item => item.pptId === props.pptId)
            if (propDetail) {
              const { mouldCode, ...data } = propDetail
              return Object.assign({}, props, data)
            }

            return props
          })
          this.propDetailVisible = true
        })
    }
  },
  methods: {
    formatter (row, col, cell) {
      return ['普通参数', '匹配参数'][cell]
    },

    addOrEdit (prop) {
      if (prop.id) {
        this._editProperty(prop)
      } else {
        this._addProperty(prop)
      }
    },

    _fetchKindProps (params) {
      return Api.get(`${this.type}KindProperties`, params)
    },

    addKindProp () {
      forms[`${this.type}Property`]({kindId: this.item.kindId}, 'add').then(form => this.$showForm(form).$on('submit', (formData, close) => {
        Api.post(`${this.type}KindProperties`, formData).then(kindProp => {
          this.kindProps.push(kindProp)
          close()
        })
      }))
    },

    editKindProp (row) {
      forms[`${this.type}Property`](row, 'edit').then(form => this.$showForm(form).$on('submit', (formData, close) => {
        Api.put(`${this.type}KindProperties/${formData.pptId}`, formData).then(_ => {
          const index = this.kindProps.findIndex(kp => kp.pptId === formData.pptId)
          ~index && this.kindProps.splice(index, 1, formData)
          this.$message.success('修改成功')
          close()
        })
      }))
    },

    deleteKindProp (id) {
      this.$confirm('此操作将永久删除该BOM, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        Api.delete(`${this.type}KindProperties/${id}`).then(_ => {
          const index = this.kindProps.findIndex(kp => kp.pptId === id)
          ~index && this.kindProps.splice(index, 1)
          this.$message.success('删除成功!')
        })
      })
    },

    _fetchPropDetails (code) {
      const params = {}
      params[this.modelCode] = code
      return Api.get(`${this.type}PropertyDetails`, params)
    },

    _addProperty (prop) {
      forms[`${this.type}PropertyDetail`](prop, 'add')
        .then(form => this.$showForm(form).$on('submit', (formData, close) => {
          const { pptName, ...data } = formData
          Api.post(`${this.type}PropertyDetails`, data).then(newProp => {
            this._updateProperty(Object.assign(newProp, { pptName }))
            this.$emit('change', newProp)
            this.$message.success('添加成功!')
            close()
          })
        }).$on('update:pptCondition', this._handleConditionChange))
    },

    _editProperty (prop) {
      forms[`${this.type}PropertyDetail`](prop, 'edit')
        .then(form => this.$showForm(form).$on('submit', (formData, close) => {
          const { pptName, ...data } = formData
          Api.put(`${this.type}PropertyDetails/${data.id}`, data).then(_ => {
            this._updateProperty(Object.assign(data, { pptName }))
            this.$emit('change', data)
            this.$message.success('修改成功')
            close()
          })
        }).$on('update:pptCondition', this._handleConditionChange))
    },

    _updateProperty (prop) {
      const index = this.propertyList.findIndex(p => p.pptId === prop.pptId)
      if (~index) {
        this.$set(this.propertyList[index], 'id', prop.id)
        this.$set(this.propertyList[index], 'pptCondition', prop.pptCondition)
        this.$set(this.propertyList[index], 'pptVal', prop.pptVal)
        this.$set(this.propertyList[index], 'pptMax', prop.pptMax)
        this.$set(this.propertyList[index], 'pptMin', prop.pptMin)
        this.$set(this.propertyList[index], 'enable', prop.enable)
      }
    },

    _handleConditionChange (pptCondition, item, formItems, rules) {
      formItems[3].disabled = pptCondition === 'between'
      formItems[4].disabled = pptCondition !== 'between'
      formItems[5].disabled = pptCondition !== 'between'
      if (pptCondition === 'between') {
        this.$set(rules, 'pptVal', [{ required: false }])
        this.$set(rules, 'pptMin', [{ required: true, type: 'number', trigger: 'blur' }])
        this.$set(rules, 'pptMax', [{ required: true, type: 'number', trigger: 'blur' }])
      } else {
        this.$set(rules, 'pptVal', [{ required: true, pattern: /^\d+(\.\d+)?$/, transform: value => value && value.trim(), message: '请输入数字', trigger: 'blur' }])
        this.$set(rules, 'pptMin', [{ required: false, type: 'number' }])
        this.$set(rules, 'pptMax', [{ required: false, type: 'number' }])
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
  margin: 0 10px;
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
