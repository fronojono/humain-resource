import React, { Component } from 'react';
import { connect }from 'react-redux'
import query from "react-hoc-query"
import {isLoggedIn} from '../../libs/api'
import ItemUser from '../../components/list-users/'
import {addToast} from '../../app/actions'

@query({
  key: "listUsers",
  op: isLoggedIn
})
@connect(({ query }) => (
  {
  currentDetails: query.DEFAULT,
}),
{
  addToast,
},
)

export default class ListUsers extends Component {

  renderListUsers=()=>{
    const { currentDetails } =this.props
    let listOfUsers=[]
    if(currentDetails&&currentDetails.listUsers&&currentDetails.listUsers.data){
      listOfUsers=currentDetails.listUsers.data.map((lou,i)=>{


         let {street,city,zipcode} = lou.address
        if(street){
          const { addToast }=this.props
          addToast('ok','hide')
        }
        return <ItemUser
        name={lou.name}
        username={lou.username}
        email={lou.email}
        website={lou.website}
        street={street}
        city={city}
        zipcode={zipcode}
        key={i}/>
      })
    }
    return listOfUsers
  }
  render() {
    return (
      <div>
        <h1>List Of Users</h1>
          {this.renderListUsers()}
      </div>
    );
  }
}
