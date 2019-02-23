import React, { Component } from 'react';
import cabifyLogo from '../images/cabify-logo.svg';
import error from '../images/warning.svg';
import SelectBox from './SelectBox';
import '../styles/App.css';
let retrievedData = localStorage.getItem('businessCard');
let dataParsed = {};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      focus: false,
      selected: "",
      mailError: false,
      data: {
        fullname: "",
        jobdescription: "",
        countryCode: "",
        phoneNumber: "",
        email: "",
        website: "www.cabify.com",
        address: "",
      },
    }

    this.input = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeInputSelectBox = this.handleChangeInputSelectBox.bind(this);
    this.handleClickFocus = this.handleClickFocus.bind(this);
    this.saveLocalStorage = this.saveLocalStorage.bind(this);
    this.retrievedLocalStorage = this.retrievedLocalStorage.bind(this);
    this.enableSubmit = this.enableSubmit.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
  }

  componentDidMount() {
    this.retrievedLocalStorage();
  }

  retrievedLocalStorage() {
    if (retrievedData !== null) {
      dataParsed = JSON.parse(retrievedData);
      this.setState({
        data: dataParsed
      }, this.enableSubmit);
    }
  }

  //check if the form is completed and we can send the request
  enableSubmit() {
    const { data } = this.state;
    const dataValueToArray = Object.values(data);
    const emptyObjects = dataValueToArray.filter(function (value) {
      return value.length === 0;
    });
    if (emptyObjects.length > 0) {
      this.setState({
        isEmpty: true,
      }, this.saveLocalStorage);
    }
    else {
      this.setState({
        isEmpty: false,
      }, this.saveLocalStorage);
    }
  }

  handleClickFocus(e) {
    this.setState({
      selected: e.target.name,
    });
  }

  handleChangeInput(e) {
    const { target: { name, value } } = e
    this.setState({
      data: {
        ...this.state.data,
        [name]: value
      }
    }, this.enableSubmit);

  }

  handleChangeInputSelectBox(value) {
    this.setState({
      data: {
        ...this.state.data,
        countryCode: value,
      }
    }, this.saveLocalStorage)
  }

  saveLocalStorage() {
    localStorage.setItem("businessCard", JSON.stringify(this.state.data));
  }

  handleSubmit(e) {
    const { data } = this.state;
    e.preventDefault();
    if (data.email.includes("@" && ".")) {
      this.setState({ mailError: false }, this.sendRequest)
    }
    else {
      this.setState({ mailError: true })
    }

  }
  sendRequest() {
    console.log("we can send the request")
  }

  render() {
    const { data, selected, isEmpty, mailError } = this.state;
    return (
      <div className="mainWrapper row">
        <article className="businessCard col col6">
          <figure className="businessCard-badge">
            <a
              className="businessCard-badge-logo" href="http://www.cabify.com">
              <img src={cabifyLogo} alt="Cabify" />
            </a>
          </figure>
          <h1 className="title-main">Request your business card</h1>
          <div className="businessCard-cards">
            <div className="businessCard-cardBack" />
            <div className="businessCard-cardFront">
              <div>
                <p className="businessCard-cardFront-title">
                  {data.fullname}
                </p>
                <p className="businessCard-cardFront-subtitle">
                  {data.jobdescription}
                </p>
              </div>
              <div className="businessCard-cardFront-bottom">
                <p className="businessCard-icon-phone">
                  {`+ ${data.countryCode} ${data.phoneNumber}`}
                </p>
                <p className="businessCard-icon-email">{data.email}</p>
                <p className="businessCard-icon-website">{data.website}</p>
                <p className="businessCard-icon-address">
                  {data.address}
                </p>
              </div>
            </div>
          </div>
        </article>
        <article className="builder col col6">
          <form className="form" action="">
            <div className="row">
              <div className={`formField-input col col12 
                ${selected === "fullname" ? "focus active" : ""} 
                ${data.fullname.length > 0 ? "active" : ""}`}>
                <div className="input">
                  <input
                    type="text"
                    name="fullname"
                    value={data.fullname}
                    onChange={this.handleChangeInput}
                    onClick={this.handleClickFocus} />
                  <label htmlFor="fullname">Full name</label>
                </div>
              </div>
            </div>
            <div className="row row-separationMedium">
              {/* you probably need to add active/focus/disabled classNames */}
              <div className={`formField-input col col12 
                ${selected === "jobdescription" ? "focus active" : ""} 
                ${data.jobdescription.length > 0 ? "active" : ""}`}>
                <div className="input">
                  <input
                    type="text"
                    name="jobdescription"
                    value={data.jobdescription}
                    onChange={this.handleChangeInput}
                    onClick={this.handleClickFocus}
                  />
                  <label htmlFor="jobdescription">Job description</label>
                </div>
              </div>
            </div>
            <div className="row row-separationMedium row-gutterMedium">
              <div className="formField-input active col col3">
                {/* select field will be placed here */}
                <SelectBox
                  handleChangeInputSelectBox={this.handleChangeInputSelectBox}
                  dataParsedToSelectBox={dataParsed.countryCode}
                />
              </div>
              <div className={`formField-input col col9
                ${selected === "phoneNumber" ? "focus active" : ""} 
                ${data.phoneNumber.length > 0 ? "active" : ""}`}>
                <div className="input">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={data.phoneNumber}
                    onChange={this.handleChangeInput}
                    onClick={this.handleClickFocus}
                  />
                  <label htmlFor="ponenumber">Phone number</label>
                </div>
              </div>
            </div>
            <div className="row row-separationMedium">
              <div className={`formField-input 
                ${selected === "email" ? "focus active" : ""} 
                ${data.email.length > 0 ? "active" : ""}
                ${mailError ? "error" : ""}  
                col col12`}>
                <div className="input input-warning">
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={this.handleChangeInput}
                    onClick={this.handleClickFocus}
                  />
                  <img
                    src={error}
                    style={{ display: mailError ? "block" : "none" }}
                    alt="error" />
                  <label htmlFor="email">Email</label>
                </div>
              </div>
            </div>
            <div className="row row-separationMedium">
              <div className="formField-input active disabled col col12">
                <div className="input">
                  <input
                    disabled="disabled"
                    type="text"
                    name="website"
                    onChange={this.handleChangeInput}
                    value={data.website}
                  />
                  <label htmlFor="website">Website</label>
                </div>
              </div>
            </div>
            <div className="row row-separationMedium">
              <div className={`formField-input col col12
                ${selected === "address" ? "focus active" : ""} ${data.address.length > 0 ? "active" : ""}`}>
                <div className="input">
                  <input
                    type="text"
                    name="address"
                    value={data.address}
                    onChange={this.handleChangeInput}
                    onClick={this.handleClickFocus}
                  />
                  <label htmlFor="address">Address</label>
                </div>
              </div>
            </div>
            <div className="row row-separationHuge">
              <input className={`button button-full button-primary 
                ${isEmpty ? "disabled" : ""}`}
                type="submit"
                value="Request"
                onClick={this.handleSubmit}
              />
            </div>
          </form>
        </article>
      </div>
    );
  }
}

export default App;
