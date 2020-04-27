import React from 'react';
import { Paper,Avatar } from 'react-md';
import './style.scss'
const ItemUser = ({name,username,email,website,street,city,zipcode}) => (
  <div className="papers__container container-list">    
      <Paper
        key={0}
        zDepth={2}
        className="papers__example"
      >
       <div>
       <Avatar random> {name.charAt(0)}</Avatar>
         <strong className='name-user'>{name}</strong>
         <div>{username}</div>
         <div>{email}</div>
         <div>{website}</div>
         <div>{street} - {city} - {zipcode}</div>
         
         </div>
      </Paper>
   
  </div>
);

export default  ItemUser