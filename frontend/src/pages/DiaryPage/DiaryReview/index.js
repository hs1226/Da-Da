import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Message } from 'semantic-ui-react'
import { reviewBox } from './StyledDiaryReview'

// 컴포넌트
import ComponentLoader from '../../../components/Loader/ComponentLoader'
import Comment from './Comment'
import Article from './Article'
import SubHeader from '../SubHeader'
import ErrorMessage from '../../../components/Messages/ErrorMessage'

// 리덕스 액션
import { getCommentFromDB } from '../../../actions/review'
import { getArticleFromDB } from '../../../actions/review'

// helper: 오늘 날짜 API Query형식
import { dateStringForApiQuery } from '../../../helper/date'

class DiaryReview extends Component {
  constructor(props) {
    super(props)
  }

  // 다이어리 리뷰 페이지 첫 로드시 get.
  // db에 작성된 로그가 이미 있는지 확인하기 위함.
  // 데이터 유무에 따라 보여지는 화면이 다름. (읽기모드/쓰기모드)
  // componentWillMount() {
  //   const { dateState } = this.props
  //   const queryDate = dateStringForApiQuery(
  //     dateState,
  //   )
  // }

  componentDidMount() {
    const queryDate = dateStringForApiQuery(this.props.dateState)
    this.props.getCommentFromDB(queryDate)
    this.props.getArticleFromDB(queryDate)
  }

  render() {
    // 시스템 에러 발생시
    if (this.props.errorState) {
      return <ErrorMessage />
    }

    // 로딩 중 (요청 후 응답이 오지 않은 상태)
    if (this.props.isLoading) {
      return <ComponentLoader />
    }

    return (
      <div>
        <Segment style={reviewBox}>
          {/* title */}
          <SubHeader tabNameEN="REVIEW" tabNameKR="일기" icon="reviewIcon" />
          {/* 오늘의 반성일기 */}
          <Comment />
          {/* 오늘의 일기*/}
          <Article />
        </Segment>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    dateState: state.today.date,
    // 하나라도 에러면 에러
    errorState: state.comment.errorState || state.article.errorState,
    // 하나라도 로딩이면 로딩
    isLoading: state.comment.isLoading || state.article.isLoading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCommentFromDB: (date) => dispatch(getCommentFromDB(date)),
    getArticleFromDB: (date) => dispatch(getArticleFromDB(date)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiaryReview)
