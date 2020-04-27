/* eslint-disable react/prop-types */
import React from 'react';
import { Card, Media, MediaOverlay, CardTitle, CardText, MenuButton, ListItem } from 'react-md';
import query from 'react-hoc-query';
import { ListEvent } from '../../libs/api';

import noImg from './Image-not-available.jpg';
import './style.scss';

@query({
	key: 'ListEvent',
	name: 'ListEvent',
	op: ListEvent
})
export default class EventCard extends React.Component {
	showDeleteEvent = (id) => {
		const { show } = this.props;
		show && show(id);
	};
	render() {
		const { ListEvent } = this.props;
		const eventList = ListEvent && ListEvent.data && ListEvent.data.d;
		return (
			<div className="eventCard md-grid">
				{eventList &&
					eventList.map((el, key) => {
						return (
							<Card className="eventCard-item md-cell md-cell--4 md-cell--6-tablet">
								<MenuButton
									id="menu-button-2"
									icon
									menuItems={[
										<ListItem
											key={1}
											primaryText="Delate event"
											onClick={() => this.showDeleteEvent(el.id)}
										/>,
										<ListItem key={2} primaryText="Edit event" />
									]}
									centered
									className="eventCard-menuButton"
									listClassName="eventCard-menu"
									anchor={{
										x: MenuButton.HorizontalAnchors.CENTER,
										y: MenuButton.VerticalAnchors.CENTER
									}}
								>
									more_vert
								</MenuButton>
								<Media>
									<img
										alt={''}
										src={
											el.EventDoc && el.EventDoc[0] ? (
												`http://localhost:8800${el.EventDoc[0].URL}`
											) : (
												noImg
											)
										}
									/>
									{/* <EventSlider ListEvent={el.EventDoc || []} /> */}
									<MediaOverlay>
										<CardTitle title={el.EventName} subtitle={el.EventStartDate} />
									</MediaOverlay>
								</Media>
								<CardText>
									<p>{el.EventDescription}</p>
								</CardText>
							</Card>
						);
					})}
			</div>
		);
	}
}
