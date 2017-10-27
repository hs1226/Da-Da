import React, { Component } from 'react'
import {
  Segment,
  Label,
  Modal,
  Image,
} from 'semantic-ui-react'
import zoomIcon from '../../../static/img/diary-zoom.svg'
import * as Style from './StyledDiaryFood'

class DiaryFoodAlbumListCard extends Component {
  state = { open: false }

  show = size => () =>
    this.setState({ size, open: true })
  close = () => this.setState({ open: false })
  render() {
    return (
      <Segment
        style={{
          ...Style.albumCard,
          backgroundImage: `url(${this.props
            .picture})`,
        }}
      >
        <Label
          attached="top"
          style={{
            ...Style.albumLabel,
            ...Style.albumCardLabelTop,
          }}
        >
          {this.props.meal_tag} 식사
          <div>
            <Modal
              trigger={
                <img
                  src={zoomIcon}
                  className="diary-food-meal-list-card-icon"
                  alt="클릭하면 음식사진을 확대해서 확인할 수 있습니다."
                />
              }
              basic
              size="small"
            >
              <Modal.Content>
                <Image
                  src={this.props.picture}
                  size="big"
                  shape="rounded"
                  centered
                />
              </Modal.Content>
            </Modal>
            {/*<img
              src={eidtIcon}
              onClick={this.show('mini')}
              className="diary-food-meal-list-card-icon"
              alt="클릭하면 음식사진을 다른 사진으로 교체할 수 있습니다."
            />
            <Modal
              size={size}
              open={open}
              onClose={this.close}
            >
              <Modal.Header
                sub
                style={{
                  padding: '14px',
                }}
              >
                {' '}
                계란프라이
                {/* <Input
                  focus
                  placeholder="계란프라이"
                  className="diary-food-album-list-card-edit-modal"
                  style={{
                    fontSize: '14px',
                  }}
                />
              </Modal.Header>
              <Modal.Content>
                <div className="diary-file-upload">
                  <label
                    for="upload"
                    className="diary-file-upload__label"
                  >
                    다른 음식 사진으로 교체하기
                  </label>
                  <input
                    id="upload"
                    className="diary-file-upload__input"
                    type="file"
                    name="file-upload"
                  />
                </div>
                <Image
                  src={foodImg}
                  size="big"
                  shape="rounded"
                  centered
                />
              </Modal.Content>
              <Modal.Actions>
                <Button basic style={cancelBtn}>
                  취소
                </Button>
                <Button
                  className="diary-food-meal-submitBtn"
                  style={submitBtn}
                >
                  수정
                </Button>
              </Modal.Actions>
            </Modal>

            <img
              src={trashIcon}
              className="diary-food-meal-list-card-icon"
              alt="클릭하면 해당 음식사진이 삭제됩니다."
            />*/}
          </div>
        </Label>
        <Label
          attached="bottom"
          style={{
            ...Style.albumLabel,
            ...Style.albumCardLabelBtoom,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <span>{this.props.name}</span>
          <span style={{ textAlign: 'right' }}>
            {this.props.kcal} kcal
          </span>
        </Label>
      </Segment>
    )
  }
}

export default DiaryFoodAlbumListCard
