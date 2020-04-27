import React, { Component } from 'react';
import {
  MenuButton,
  DropdownMenu,
  AccessibleFakeButton,
  Button,
  Avatar,
} from "react-md"
import './styles.scss'
export default class TopBar extends Component {
  render() {
    return (
      <div className="ams-apptitlebar">
        <DropdownMenu
          id="app-title-bar"
          menuItems={{
            primaryText: "",
          }}
          position={MenuButton.Positions.TOP_LEFT}
          anchor={{
            x: MenuButton.HorizontalAnchors.INNER_LEFT,
            y: MenuButton.VerticalAnchors.BOTTOM,
          }}
          simplifiedMenu={false}
        >
          <AccessibleFakeButton className="ams-apptitlebar-logo">
            
          </AccessibleFakeButton>
        </DropdownMenu>

        <div className="ams-apptitlebar-sep" />

        <Button className="ams-title-bar-item-right-space ams-btn--nano" icon>
          notifications
        </Button>
        <Button className="ams-title-bar-item-right-space ams-btn--nano" icon>
          help
        </Button>
        <Avatar className="ams-title-bar-item-right-space-half" suffix="blue">
          M
        </Avatar>
        <div className="ams-title-bar-item-right-space-half">
          <MenuButton
            id="app-title-bar-more"
            menuItems={[
              {
                primaryText: "Settings",
              },
              {
                primaryText: "Sign out",
                onClick: this.signOut,
              },
            ]}
            anchor={{
              x: MenuButton.HorizontalAnchors.INNER_RIGHT,
              y: MenuButton.VerticalAnchors.BOTTOM,
            }}
            simplifiedMenu={false}
            icon
          >
            more_vertical
          </MenuButton>
        </div>
        <div className="ams-apptitlebar-langtext">
          <MenuButton
            className="ams-apptitlebar-langtext ams-title-bar-item-right-space"
            id="app-title-bar-lang"
            menuItems={["English"]}
            flat
            iconChildren="arrow_drop_down"
            iconBefore={false}
            anchor={{
              x: MenuButton.HorizontalAnchors.INNER_RIGHT,
              y: MenuButton.VerticalAnchors.BOTTOM,
            }}
            simplifiedMenu={false}
          >
            ENG
          </MenuButton>
        </div>
        <Button
          icon
          className="ams-apptitlebar-collapse-btn"
          
          onClick={this.onToggleClick}
        />
      </div>
    );
  }
}

 