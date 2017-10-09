import React from 'react'
import { List, Divider } from 'semantic-ui-react'

const textSmall = {
  fontSize: '12px',
}

const text = {
  fontSize: '17px',
  letterSpacing: '-0.3px',
  color: '#16325c',
}

const textBig = {
  fontSize: '28px',
  letterSpacing: '-1px',
  color: '#16325c',
  fontFamily: 'Montserrat-Bold',
}

const ShareDiaryFitnessAdd = () => (
  <div>
    <List horizontal style={{ width: '95%' }}>
      <List.Item
        style={{ width: '20%', margin: '0' }}
      >
        <List.Header style={text}>
          팔 굽혀 펴기
        </List.Header>
      </List.Item>
      <List.Item
        style={{ width: '20%', margin: '0' }}
      />
      <List.Item
        style={{
          width: '30%',
          margin: '0',
          textAlign: 'right',
        }}
      >
        <List.Header style={text}>
          30분
        </List.Header>
      </List.Item>
      <List.Item
        style={{
          width: '30%',
          margin: '0',
          textAlign: 'right',
        }}
      >
        <List.Header style={textSmall}>
          <span style={textBig}>105 </span>kcal
        </List.Header>
      </List.Item>
    </List>
    <Divider />
  </div>
)

export default ShareDiaryFitnessAdd
