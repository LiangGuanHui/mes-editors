<template>
  <div class="date-container">
    <div class="month-year">
      <span class="calendar-month">{{ dayOfMonth.format('YYYY') }}年{{ dayOfMonth.format('MM') }}月</span>
    </div>

    <div class="week-days"><span v-for="day in weekDays" :key="day.id">{{ day }}</span></div>

    <div class="days">
      <day-cell
        v-for="(day, index) in days"
        :key="index"
        :isSelected="isSelected(day)"
        :day="day"
        @dayClick="handleDayClick"
      ></day-cell>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import DayCell from './DayCell.vue'

export default {
  name: 'ExCalendar',
  props: {
    firstDayOfWeek: {
      type: Number,
      default: () => moment.localeData().firstDayOfWeek()
    },
    disableDaysBeforeToday: {
      type: Boolean,
      default: true
    },
    defaultDate: {
      type: String
    }
  },
  components: {
    DayCell
  },
  data () {
    return {
      weekDays: [],
      days: [],
      dayOfMonth: moment(),
      date: this.defaultDate ? moment(this.defaultDate, 'YYYY-MM-DD') : moment(),
      trDate: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  watch: {
    defaultDate (val) {
      this.date = moment(val, 'YYYY-MM-DD')
      this.resetDayOfMonth()
      this.$emit('change', this.date)
    }
  },
  methods: {
    resetDayOfMonth () {
      if (this.date.format('YYYY-MM') !== this.dayOfMonth.format('YYYY-MM')) {
        let _diff = Number(this.date.diff(this.dayOfMonth, 'months'))
        this.dayOfMonth.add(_diff, 'months')
        this.initDays()
      }
    },
    initWeekDays () {
      const days = this.trDate
      const dow = this.firstDayOfWeek
      this.weekDays = []
      for (let i = dow; i < 7 + dow; i++) {
        let day = i % 7
        this.weekDays.push(days[day])
      }
    },
    initDays () {
      this.days = []
      const firstDayOfWeek = this.firstDayOfWeek
      const startOfMonth = this.dayOfMonth.startOf('month').isoWeekday()
      const monthNumber = this.dayOfMonth.month()
      const dayCount = this.dayOfMonth.daysInMonth()
      const lastMonth = this.dayOfMonth.clone().month(monthNumber - 1)
      const lastMonthDayCount = lastMonth.daysInMonth()
      const nextMonth = this.dayOfMonth.clone().month(monthNumber + 1)
      const diff = (Math.abs(firstDayOfWeek - (startOfMonth + 7)) % 7)
      for (let i = diff - 1; i >= 0; i--) {
        const dayMoment = lastMonth.clone().date(lastMonthDayCount - i)
        this.days.push({dayMoment, isPassive: true})
      }
      for (let i = 1; i <= dayCount; i++) {
        const dayMoment = this.dayOfMonth.clone().date(i)
        let isPassive = this.isPassive(dayMoment)
        this.days.push({ dayMoment, isPassive })
      }
      const remainingCells = 42 - this.days.length // 42cells = 7days * 6rows
      for (let i = 1; i <= remainingCells; i++) {
        const dayMoment = nextMonth.clone().date(i)
        this.days.push({ dayMoment, isPassive: true })
      }
    },
    isSelected (day) {
      return day.dayMoment && day.dayMoment.format('YYYY-MM-DD') === this.date.format('YYYY-MM-DD')
    },
    isPassive (dayMoment) {
      let today = moment()
      if (this.disableDaysBeforeToday && Number(dayMoment.diff(today, 'days')) <= -1) {
        return true
      }
    },
    handleDayClick (day) {
      if (day.dayMoment.format('YYYY-MM') === this.dayOfMonth.format('YYYY-MM')) {
        this.date = day.dayMoment
        this.$emit('dayChange', day.dayMoment)
      }
    },
    changeMonth (delta) {
      this.dayOfMonth.add(delta, 'months')
      // this.$emit('monthChange', this.dayOfMonth)
      this.initDays()
    },
    editMonth () {

    }
  },
  created () {
    this.initWeekDays()
    this.initDays()
    this.resetDayOfMonth()
  }
}
</script>

<style scoped>
.date-container, .selected-container { margin: 0 auto; padding: 0px; min-width: 300px; max-width: 450px; }
.month-year { text-align: center; height: 4rem; line-height: 4rem; }
.month-button { display: inline-block; box-sizing: border-box; padding: 0; margin: 0 0.7rem; border: none; outline: none; background-color: #fbfbfb; border-radius: 50%; width: 42px; height: 42px; margin-top: 13px; cursor: pointer; }
.month-button-prve { float: left; }
.month-button-next { float: right; }
.month-arrow { display: inline-block; height: 100%; line-height: 100%; border-top: 2px solid #bebebe; width: 10px; height: 10px; }
.month-arrow-prev { border-left: 2px solid #bebebe; transform: rotate(-45deg); margin-left: 4px; }
.month-arrow-next { border-right: 2px solid #bebebe; transform: rotate(45deg); margin-right: 2px; }
.week-days span { padding: 10px 0; display: inline-block; width: 14.28%; text-align: center; font-size: 18px; color: #797979; }
.calendar-month { font-size: 36px; margin-left: 40px; text-align: center; color: #818181; }

@media (max-width: 320px) {
  .calendar-month { margin-left: 0; line-height: 2; }
}
</style>
