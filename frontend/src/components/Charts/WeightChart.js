import React from 'react'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
// 스타일링
import { Message } from 'semantic-ui-react'
// 차트
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const WeightChart = props => {
  if (isEmpty(props.weightAllLog)) return null
  if (props.errorState) {
    return (
      <Message negative>
        <Message.Header>
          오류가 발생하였습니다.
        </Message.Header>
        <p>잠시 후 다시 시도해주세요.</p>
      </Message>
    )
  }

  return (
    <AreaChart
      key={String(Math.random())}
      width={830}
      height={260}
      data={props.weightAllLog}
      margin={{
        top: 10,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <defs>
        <linearGradient
          id="colorCurrent"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="5%"
            stopColor="#485563"
            stopOpacity={0.04}
          />
        </linearGradient>
        <linearGradient
          id="colorGoal"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="5%"
            stopColor="transparent"
            stopOpacity={0.8}
          />
          <stop
            offset="98%"
            stopColor="transparent"
            stopOpacity={0}
          />
        </linearGradient>
      </defs>
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="current"
        stroke="#485563"
        fillOpacity={1}
        fill="url(#colorCurrent)"
      />
      <Area
        type="monotone"
        dataKey="goal"
        stroke="#2A8CAD"
        fillOpacity={1}
        fill="url(#colorGoal)"
      />
    </AreaChart>
  )
}
const mapStateToProps = state => {
  return {
    weightAllLog: state.weightAll.allLog,
    errorState: state.weightAll.errorState,
  }
}

export default connect(mapStateToProps, null)(
  WeightChart,
)
