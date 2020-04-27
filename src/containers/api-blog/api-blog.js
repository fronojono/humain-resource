import React, { Component } from 'react';
import { TextField,Button } from 'react-md';
import {connect} from 'react-redux'
import mutate from '../../libs/hoc/mutate'
import query from "react-hoc-query"

import {ApiPost1,listDataPost} from '../../libs/api'
import './style.scss'

@mutate({
  moduleName: "AddPost",
  mutations: {
    AddPost: ApiPost1,
  },
})
@query({
  key: "listDataPost",
  op: listDataPost
})
@connect(({ query }) => (
  {
  currentDetails: query.DEFAULT,
}))

export default class ApiBlog extends Component {
  constructor(props){
    super(props)
    this.state={
      title:'',
      category:'',
      content:''
    }
  }
  
  handleSubmit=()=>{
    const { title,category,content } =this.state
    const { mutations:{ AddPost } } =this.props
    AddPost(title,category,content)
  }
  renderListOfPost=()=>{
    const { currentDetails } =this.props
    let posts=[]
    if(currentDetails&&currentDetails.listDataPost&&currentDetails.listDataPost.data&&currentDetails.listDataPost.data.data){
      posts=currentDetails.listDataPost.data.data.map((item,index)=>{
        return (
      <tr key={index}>
      <th scope="row" >{item.identifier}</th>
      <td>{item.title}</td>
      <td>{item.creationDate}</td>
      <td>{item.details}</td>
    </tr>
        )
      })
    }
    return posts
  }
  render() {
    const { title,category,content } =this.state
    return (
      <div className="container">
    
  <div className="panel panel-default">
      <div className="panel-heading">Panel Heading</div>
      <div className="panel-body">

      <TextField id="placeholder-only-title"
         placeholder="Title" 
         value={title} 
         onChange={title=>this.setState({title})}
          />
        <TextField
          id="placeholder-only-multiline"
          placeholder="categories"
          value={category}
         onChange={category=>this.setState({category})}
          
        />
        <TextField
          id="placeholder-only-password"
          placeholder="content"          
          rows={3}
          value={content}
         onChange={content=>this.setState({content})}
          
        />
        <Button flat className='btn btn-primary' onClick={this.handleSubmit}>Submit</Button>
      
    </div>
    </div>
    <div className="panel panel-default">
  <div className="panel-heading">List Of Post</div>
    <div className="panel-body">
    <table className="table">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Title</th>
      <th scope="col">Categories</th>
      <th scope="col">Content</th>
    </tr>
  </thead>
  <tbody>
    {this.renderListOfPost()}
    </tbody>
    </table>
    </div>
   <i className="material-icons">
    globe_icon
</i>
<i className="material-icons">
accessibility
</i>
  </div>
  </div>
       
    );
  }
}

 