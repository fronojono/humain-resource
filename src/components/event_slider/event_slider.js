import React, { Component } from "react";
import ReactSwipe from "react-swipe";

const imageStyles = {
  margin: "0 auto",
  width: "100%",
  height: "300px"
};


// change Swipe.js options by query params
const startSlide = 0;
const swipeOptions = {
  startSlide: startSlide >= 0 ? startSlide : 0,
  auto: 1000,
  speed: 1000,
  disableScroll: true,
  continuous: true,
  callback() {
    console.log("slide changed");
  },
  transitionEnd() {
    console.log("ended transition");
  }
};

export default class EventSlider extends Component {
  next() {
    this.reactSwipe.next();
  }

  prev() {
    this.reactSwipe.prev();
  }

  renderImage = () => {
    const { ListEvent } = this.props
    return ListEvent.map((el, index) => {
      return (<div key={index}>
        <div className="item">
          <img
            style={imageStyles}
            alt={`slide${index}`}
            src={`http://localhost:8800${el.URL}`}
          />
        </div>
      </div>)
    })
  }
  render() {
    return (
      <div className="center">

        <ReactSwipe
          ref={reactSwipe => (this.reactSwipe = reactSwipe)}
          className="mySwipe"
          swipeOptions={swipeOptions}
        >
          { /* paneNodes({ EventDoce: [ListEvent] }) */}
          {this.renderImage()}
        </ReactSwipe>

      </div>
    );
  }
}