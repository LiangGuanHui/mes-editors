<template>
  <div id="DialogForm">
    <el-dialog :title="title" :visible.sync="visible" :before-close="close" @closed="handleClosed" :width="width" top="10vh">
      <el-form :model="form" :rules="formRules" label-width="100px" ref="form">
        <el-row :gutter="20">
          <el-col class="col" v-for="item in formItems" :key="item.value" :span="item.span || 24">
            <el-form-item :label="item.label" :prop="item.value">
              <component :is="item.component" v-model.trim="form[item.value]"
                :type="item.type"
                :options="item.options"
                :active-value="item.activeValue"
                :inactive-value="item.inactiveValue"
                :disabled="item.disabled"
                :unit="item.unit"
                :picker-options="item.pickerOptions"
                @change="$emit(`update:${item.value}`, form[item.value], item, formItems, rules, form)"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reset">重 置</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DialogForm',
  props: {
    title: {
      type: String,
      default: '表单'
    },
    width: {
      type: String,
      default: '50%'
    },
    formItems: {
      type: Array,
      required: true
    },
    formData: {
      type: Object,
      default () {
        return {}
      }
    },
    rules: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    formRules () {
      const rules = {...this.rules}
      Object.keys(this.rules).map(key => {
        rules[key].map(rule => {
          rule.form = this.form
        })
      })
      return rules
    }
  },
  data () {
    return {
      visible: false,
      form: {}
    }
  },
  methods: {
    reset () {
      this.form = JSON.parse(JSON.stringify(this.formData))
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', JSON.parse(JSON.stringify(this.form)), this.close)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    close () {
      this.visible = false
    },
    handleClosed () {
      this.$emit('closed')
    }
  },
  mounted () {
    this.reset()
  }
}
</script>

<style scoped>
#DialogForm .el-input__inner {
  border: 10px solid #bfc0c1;
  border-radius: 0;
}
#DialogForm .col {
  height: 62px;
}
</style>
