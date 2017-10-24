import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// 차트
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
} from 'recharts'
// YYYY. MM. DD.(날짜 기본 포맷)를 api 요청 포맷(YYYYMMDD)으로 변환하는 함수
import {
  dateStringForApiQuery,
  dateDotToDateType,
} from '../../helper/date'
// 리덕스 액션
import { getNutritionFactsForAWeekFromDB } from '../../actions/reportAPIs'

class CaloriesChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 기준일의 6일 전 날짜 (YYYYMMDD)
      startDate: dateStringForApiQuery(
        this.props.beforeDateState,
      ),
      // 기준일 (오늘 혹은 사용자가 지정한 날짜)(YYYYMMDD)
      endDate: dateStringForApiQuery(
        this.props.lastDateState,
      ),
    }
  }

  componentWillMount() {
    const { startDate, endDate } = this.state
    // get
    this.props.getNutritionFactsForAWeekFromDB(
      startDate,
      endDate,
    )
  }

  render() {
    const {
      beforeDateState,
      defaultGoalCalorie,
      nutritionLogs,
      goalCaloriePerWeek,
    } = this.props

    let dateType = dateDotToDateType(
      beforeDateState,
    )

    const defaultGoal = 1280 // test용 static값
    // 일주일치 날짜
    const dateArray = []
    for (let i = 0; i < 7; i++) {
      dateArray.push(
        new Date(
          dateType.getFullYear(),
          dateType.getMonth(),
          dateType.getDate() + i,
        ),
      )
    }

    dateArray.map((el, index, all) => {
      const getMatched = _.reject(
        goalCaloriePerWeek,
        val => {
          return (
            val.diary_date.getTime() !==
            el.getTime()
          )
        },
      )

      const kcal = _.mapValues(
        getMatched,
        val => {
          return val.day_log_kcal
        },
      )

      all[index] = {
        day: el,
        목표칼로리: Object.values(kcal)[0]
          ? Object.values(kcal)[0]
          : defaultGoal,
      }
    })

    dateArray.map((el, index, all) => {
      const getMatched = _.reject(
        nutritionLogs,
        val => {
          return (
            val.eat_log_diary_date.getTime() !==
            el.day.getTime()
          )
        },
      )

      const nutrition = _.mapValues(
        getMatched,
        val => {
          return {
            탄수화물: Math.round(val.carb) * 4,
            단백질: Math.round(val.protein) * 4,
            지방: Math.round(val.fat) * 9,
          }
        },
      )
      all[index] = {
        ...all[index],
        day: el.day.getDate() + '일',
        ...Object.values(nutrition)[0],
      }
    })

    return (
      <ComposedChart
        width={850}
        height={300}
        data={dateArray}
        margin={{
          top: 20,
          right: 20,
          bottom: 5,
          left: 0,
        }}
      >
        <XAxis dataKey="day" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ paddingBottom: 20 }}
        />
        <Tooltip />
        <Bar
          dataKey="탄수화물"
          stackId="a"
          fill="#16325c"
          maxBarSize={55}
        />
        <Bar
          dataKey="단백질"
          stackId="a"
          fill="#54698d"
          maxBarSize={55}
        />
        <Bar
          dataKey="지방"
          stackId="a"
          fill="#a8b7c7"
          maxBarSize={55}
        />
        <Line
          type="monotone"
          dataKey="목표칼로리"
          stroke="#ffb75d"
        />
      </ComposedChart>
    )
  }
}

const mapStateToProps = state => {
  return {
    nutritionLogs:
      state.nutritionChart
        .nutritionFactsLogsPerWeek,
    goalCaloriePerWeek:
      state.caloriesChart.goalCaloriePerWeek,
    lastDateState: state.today.date,
    beforeDateState: state.beforeDay.beforeDate,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getNutritionFactsForAWeekFromDB: (
      startDate,
      endDate,
    ) =>
      dispatch(
        getNutritionFactsForAWeekFromDB(
          startDate,
          endDate,
        ),
      ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CaloriesChart)
