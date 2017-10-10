import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { itemWrap } from './StyledNavigation'
import NavItems from './NavItems'
import UserInfo from './UserInfo'

class componentName extends Component {
  render() {
    return (
      <Menu.Menu
        position="right"
        style={itemWrap}
        opacity={this.props.opacity}
        backgroundImage={
          this.props.backgroundImage
        }
      >
        <NavItems />

        {/* 유저 정보 + 팝업*/}
        <UserInfo
          inverted={this.props.inverted}
        />
      </Menu.Menu>
    )
  }
}

export default componentName