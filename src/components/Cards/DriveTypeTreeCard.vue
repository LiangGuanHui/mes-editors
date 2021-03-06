<template>
  <el-card class="h600">
    <div slot="header" class="clearfix">
      <span class="card-header--text">驱动类型清单</span>
      <el-button :disabled="addType" icon="el-icon-plus" class="fl-r p3-0" type="text" @click="addDriveType">添加驱动类型</el-button>
    </div>
    <el-tree :data="driveTypes" :props="props" :expand-on-click-node="false"
      node-key="id" @node-click="handleNodeClick">
      <span slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <el-button-group v-if="node.level === 2">
          <el-button type="text" icon="el-icon-edit" @click.stop="() => editDriveType(node, data)"/>
          <el-button type="text" icon="el-icon-delete" @click.stop="() => deleteDriveType(node, data)"/>
        </el-button-group>
      </span>
    </el-tree>
  </el-card>
</template>

<script>
import getDriveTypeForm from '@/form/driveType'
import Api from '@/utils/Api'

export default {
  name: 'DriveTypeTreeCard',
  computed: {
    disabled () {
      return !this.addType
    }
  },
  data () {
    return {
      driveTypes: [{
        value: 1,
        typeName: '数采驱动'
      }, {
        value: 2,
        typeName: '业务驱动'
      }, {
        value: 3,
        typeName: '任务驱动'
      }],
      props: {
        label: 'typeName'
      },
      addType: true,
      typeCode: '',
      checkedNode: null // 已点击的节点
    }
  },
  watch: {
  },

  methods: {
    addDriveType () {
      getDriveTypeForm(null, 'add')
        .then(form => this.$showForm(form).$on('submit', (formData, close) => {
          formData.driveClass = this.typeCode
          Api.post('DriveTypes', formData).then(driveType => {
            this.$nextTick(_ => {
              this.checkedNode.data.children.push(driveType)
            })
            this.$message.success('添加成功')
            close()
          })
        }))
    },

    editDriveType (node, nodeData) {
      getDriveTypeForm(nodeData, 'edit')
        .then(form => this.$showForm(form).$on('submit', (formData, close) => {
          Api.put(`DriveTypes/${formData.typeId}`, formData).then(_ => {
            const children = node.parent.childNodes
            const index = children.findIndex(c => c.data.typeId === formData.typeId)
            if (~index) {
              this.$set(children[index], 'data', formData)
              this.$message.success('编辑成功!')
            } else {
              this.$message.danger('编辑失败!')
            }
            close()
          })
        }))
    },

    deleteDriveType (node, nodeData) {
      this.$confirm(`此操作将永久删除该类型, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        Api.delete(`DriveTypes/${nodeData.typeId}`).then(_ => {
          const parent = node.parent
          const children = parent.data.children
          const index = children.findIndex(d => d.typeId === nodeData.typeId)
          children.splice(index, 1)
          parent.childNodes.splice(index, 1)
          this.$message.success('删除成功!')
        })
      }).catch(_ => {
        this.$message.info('已取消删除')
      })
    },

    handleNodeClick (data, node) {
      this.typeCode = ''
      if (node.level === 2) {
        this.addType = true
        this.$emit('change', data)
      } else {
        this.checkedNode = node
        this.typeCode = data.value
        this.addType = false
      }
    }
  },

  created () {
    Api.get('DriveTypes').then(data => {
      this.driveTypes.map(d => {
        this.$set(d, 'children', [])
        d.children = data.filter(item => item.driveClass === d.value)
      })
    })
  }
}
</script>

<style scoped>
</style>
