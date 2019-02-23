import React from 'react'
import PropTypes from 'prop-types';
import arrow from '../images/arrow.svg';

class SelectBox extends React.Component {
    constructor() {
        super();
        this.state = {
            listCountryCodes: [],
            showItems: false,
            value: "",
            selectedItem: [],
            keyboardInput: "",
            arrowUpDown: false,
            showItemNotFound: false,
        }

        this.handleShowSelect = this.handleShowSelect.bind(this);
        this.getCountryCodes = this.getCountryCodes.bind(this);
        this.handleSelectedItem = this.handleSelectedItem.bind(this);
        this.handleChangeInputValueToParent = this.handleChangeInputValueToParent.bind(this);
        this.retriveFromLocalStorageOrList = this.retriveFromLocalStorageOrList.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
        this.getCountryCodes();
    }

    //fetch to get country codes

    getCountryCodes() {
        fetch("https://restcountries.eu/rest/v2/all")
            .then(res => res.json())
            .then(data => {
                data.unshift({ name: "No Code", callingCodes: "" });
                this.setState({
                    listCountryCodes: data,
                    selectedItem: data[0],
                }, this.retriveFromLocalStorageOrList);
            })
            .catch(error => console.log(error));
    }

    retriveFromLocalStorageOrList() {
        const { listCountryCodes } = this.state;
        const dataParsed = this.props.dataParsedToSelectBox;
        if (dataParsed === undefined) {
            this.setState({
                value: listCountryCodes[213].callingCodes,
            }, this.handleChangeInputValueToParent);
        }
        else {
            this.setState({
                value: dataParsed
            });
        }
    }

    handleShowSelect() {
        this.setState(prevState => ({
            showItems: !prevState.showItems,
            arrowUpDown: !prevState.arrowUpDown
        }));
    }

    handleSelectedItem = (e) => {
        this.setState({
            value: e.callingCodes,
            selectedItem: e,
            showItems: false,
        }, this.handleChangeInputValueToParent);
    }

    handleChangeInputValueToParent() {
        const { value } = this.state;
        const { handleChangeInputSelectBox } = this.props;
        handleChangeInputSelectBox(value);
    }
    
    handleKeyPress(e) {
        if (e.keyCode <= 65 || e.keyCode >= 122 || e.keyCode === 93 || e.keyCode === 91) {
            this.setState({
                showItemNotFound: true,
                keyboardInput: "*",
            });
        }
        else {
            this.setState({
                keyboardInput: e.key,
                showItemNotFound: false,
            });
        }
    }

    render() {
        const { showItems, value, listCountryCodes, selectedItem, arrowUpDown, keyboardInput, showItemNotFound } = this.state;
        const keyboardFilteredList = listCountryCodes.filter((item => item.name.charAt(0).toUpperCase().includes(keyboardInput.toUpperCase())));

        return (
            <div className="input">
                <div
                    className="selectBox-input-arrow"
                    onClick={() => { this.myInp.focus(); this.handleShowSelect() }}
                >
                    <input
                        className="active focus"
                        type="num"
                        name="prefix"
                        value={`+${value}`}
                        onChange={this.handleChangeInputValueToParent}
                        onKeyDown={this.handleKeyPress}
                        ref={(inp) => this.myInp = inp}
                    />
                    <img
                        className={`${arrowUpDown ? "down" : ""}`}
                        src={arrow}
                        alt="arrow"
                    />
                </div>
                <label htmlFor="prefix">Prefix</label>
                <div className="row">
                    <ul
                        className="selectBox-select col col16"
                        style={{ display: showItems ? "block" : "none" }}
                        name="code-country"
                    >
                        <li style={{ display: showItemNotFound ? "block" : "none" }} >Not Found</li>
                        {keyboardFilteredList.map((code, index) => {
                            return (
                                <li
                                    id={index}
                                    className={`li-item ${selectedItem === code ? "selected" : ""}`}
                                    value={code.callingCodes}
                                    key={index}
                                    onClick={() => this.handleSelectedItem(code)}
                                >
                                    <div className="li-item-wrapper">
                                        <div className="li-item-wrapper-image-text">
                                            <img className="image"
                                                src={`${code.flag}`}
                                                alt="" />
                                            <p className="name">        {code.name}
                                            </p>
                                        </div>
                                        <p className="code">
                                            {`${code.callingCodes.length === 0 ? code.callingCodes : "+" + code.callingCodes}`}
                                        </p>
                                    </div>
                                </li>
                            );
                        })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
SelectBox.propTypes = {
    handleChangeInputSelectBox: PropTypes.func,
    dataParsedToSelectBox: PropTypes.array
};
export default SelectBox;