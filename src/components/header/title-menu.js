import React from 'react';
import { SelectField } from 'react-md';
import { changeLangs } from "../../langs/"
import i18n from "i18n-js"



class TitleMenu extends React.Component {
  state={
    lang:i18n.locale
  }
  changeLang=(lang)=>{
    changeLangs(lang)
    this.setState({
      lang
    })
    localStorage.setItem("language", lang)
    window.location.reload()
  }
  
  render() {
    
    return (
      <div>
      <SelectField {...data} value={this.state.lang} onChange={this.changeLang}
     /> 
     <i class="material-icons">
language
</i>
      </div>
    );
  }
}
const data = {
  id:'langs-switcher',
  menuItems:[
    { key: "en", label: "English", value: "en" },
    { key: "ar", label: "Arabic", value: "ar" },
    { key: "fr", label: "French", value: "fr" },
  ],

};
export default TitleMenu;