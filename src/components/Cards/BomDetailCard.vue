<template>
  <el-card class="h300">
    <div slot="header" class="clearfix">
      <span class="card-header--text">物料明细</span>
    </div>
    <dl v-show="bomDetail.matCode">
      <dt>BOM编号：</dt>
      <dd>{{bomDetail.bomCode}}</dd>
      <dt>物料编号：</dt>
      <dd>{{bomDetail.matCode}}</dd>
      <dt>物料名称：</dt>
      <dd>{{bomDetail.matName}}</dd>
      <dt>物料类型：</dt>
      <dd>{{bomDetail.matType === 1 ? '原材料' : '半成品'}}</dd>
      <dt>消耗基数：</dt>
      <dd>{{bomDetail.baseQty}} {{bomDetail.unit}}</dd>
      <dt>消耗数量：</dt>
      <dd>{{bomDetail.qty}} {{bomDetail.unit}}</dd>
      <dt>损耗率：</dt>
      <dd>{{bomDetail.wastage || 0}} %</dd>
      <dt>是否管控：</dt>
      <dd>{{bomDetail.beCtrl === 1 ? '是' : '否'}}</dd>
      <dt>能否超越：</dt>
      <dd>{{bomDetail.enableBeyond === 1 ? '是' : '否'}}</dd>
      <dt>可否替代：</dt>
      <dd>{{bomDetail.enableSubstitute === 1 ? '是' : '否'}}</dd>
    </dl>
  </el-card>
</template>

<script>
export default {
  name: 'BomDetailCard',
  props: {
    bomDetail: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style scoped>
dl {
  margin-top: 0;
  padding: 9px 15px;
}
dt, dd {
  color: #000;
  font-size: 14px;
  min-height: 18px;
}
dt {
  font-weight: normal;
}
dd {
  margin-left: 80px;
  margin-top: -24px;
}
dt {
  line-height: 2;
}
</style>
