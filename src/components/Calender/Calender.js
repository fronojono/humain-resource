import React, { Component } from 'react';
import CalenderContent from '../CalenderContent';
import './calender.scss';
export default class Calender extends Component {
	render() {
		return (
			<div className='calender-wrapper'>
				<CalenderContent />
			</div>
		);
	}
}
