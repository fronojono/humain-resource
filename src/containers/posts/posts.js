import React, { Component } from 'react';
import { connect }from 'react-redux'
import BigCalendar from 'react-big-calendar';
import moment from 'moment'
import query from "react-hoc-query"
import {posts,listData} from '../../libs/api'
import ItemPost from './components/'
import Helper from '../../helpers/'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

@query({
  key: "listPosts",
  op: posts
})
@connect(({ query }) => (
  {
  currentDetails: query.DEFAULT,
}))
@query({
  key: "listSearch",
  op: listData
})
export default class ListPosts extends Component {
  
  renderListSearch=()=>{
    const { currentDetails } =this.props
    let listOfSearch=[]
    if(currentDetails&&currentDetails.listSearch&&currentDetails.listSearch.data&&currentDetails.listSearch.data.hits){
      listOfSearch=currentDetails.listSearch.data.hits.map((los,i)=>{
        return <ItemPost 
        title={los.title} 
        body={los.body}        
        key={i}
        web={los.url}
        author={los.author}
        />
      })   
    return listOfSearch
  }
}
  renderListPosts=()=>{
    const { currentDetails } =this.props
    let listOfUsers=[]
    if(currentDetails&&currentDetails.listPosts&&currentDetails.listPosts.data){
      listOfUsers=currentDetails.listPosts.data.map((lop,i)=>{      
        
        return <ItemPost 
        title={lop.title} 
        body={lop.body}        
        key={i}/>
      })
    }
   
    return listOfUsers
  }
  renderEvents=()=>{
    let arrayOfEvent=Helper
    
   
    return arrayOfEvent
  }
  render() {
    return (
      <div>
      <div style={{display:'flex'}}>
        <h1>List Of Posts</h1>
          <div style={{}}>{this.renderListPosts()}</div>
         <div style={{}}>{this.renderListSearch()}</div> 
        
      </div>
      <div style={{height: '100vh', margin: '10px' ,width:'1000px',marginLeft:'200px',marginTop:'100px'}}>
		<BigCalendar
			events={this.renderEvents()}
      views={['month', 'week', 'agenda']}
      defaultView={'month'}
      defaultDate={new Date()}			
      localizer={localizer}
		/>
	</div>
	</div>
    );
  }
}

