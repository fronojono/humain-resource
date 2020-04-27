import React from 'react';
import { Paper,Avatar } from 'react-md';
import './style.scss'
  
const ItemPost = ({title,body,web,author}) => (
  <div className="papers__container container-list">
    
      <Paper
        key={0}
        zDepth={2}
       
        className="papers__example"
      >
       <div>
       <Avatar random> {title&&title.charAt(0)}</Avatar>
         <strong className='name-user'>{title}</strong>
         <div>{body}</div>
         <div>{author}</div>
         <div>{web}</div>   
         
         </div>
       
      </Paper>
   
  </div>
);

export default  ItemPost