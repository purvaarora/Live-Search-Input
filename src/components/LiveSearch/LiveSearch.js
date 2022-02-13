import React from 'react';
import { isEmpty, get, find } from 'lodash';

import './LiveSearch.scss';


class LiveSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            managersList: [],
            showListMenu: false,
            inputString: '',
            filteredList: []
        }
        this.onFocusHandler = this.onFocusHandler.bind(this);
        this.onBlurHandler = this.onBlurHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleListItemClick = this.handleListItemClick.bind(this);
    }

    async componentDidMount() {
        // Fetch data from given API and update in state
        const res = await fetch("https://gist.githubusercontent.com/daviferreira/41238222ac31fe36348544ee1d4a9a5e/raw/5dc996407f6c9a6630bfcec56eee22d4bc54b518/employees.json");
        const result = await res.json();
        if (!isEmpty(result)) {
            let tempList = []
            result.data.map((item) => {
                tempList.push({
                    name: get(item, 'attributes.name', ''),
                    email: get(find(result.included, (included) => included.id === get(item, 'relationships.account.data.id', '')), 'attributes.email', ''),
                    id: item.id
                })
            })
            this.setState({
                managersList: tempList,
                filteredList: tempList
            })
        }
    }

    componentDidUpdate() {
        var listItems = document.querySelectorAll(".liveSearch-list li");

        if (!isEmpty(listItems)) {
            var currentLI = 0;

            // remove highlighted class from all list items
            for (var i = 0; i < listItems.length; i++) {
                listItems[i].classList.remove("highlight");
            }

            // Initialize first li as the selected (focused) one:
            listItems[currentLI].classList.add("highlight");

            // Set up a key event handler for the document
            document.addEventListener("keydown", function (event) {
                // Check for up/down key presses

                switch (event.keyCode) {
                    case 38: // Up arrow    
                        // Remove the highlighting from the previous element
                        listItems[currentLI].classList.remove("highlight");

                        currentLI = currentLI > 0 ? --currentLI : 0;     // Decrease the counter      
                        listItems[currentLI].classList.add("highlight"); // Highlight the new element
                        break;
                    case 40: // Down arrow
                        // Remove the highlighting from the previous element
                        listItems[currentLI].classList.remove("highlight");

                        currentLI = currentLI < listItems.length - 1 ? ++currentLI : listItems.length - 1; // Increase counter 
                        listItems[currentLI].classList.add("highlight");       // Highlight the new element
                        break;
                    case 13:
                        this.handleListItemClick(listItems[currentLI].id.split('-')[1])

                }

                let listDiv = document.getElementById('managersList');

                if (listDiv) {
                    let elHeight = listItems[currentLI].offsetHeight;
                    let scrollTop = listDiv.scrollTop;

                    let viewport = scrollTop + listDiv.offsetHeight;
                    var elOffset = elHeight * currentLI;

                    if (elOffset < scrollTop || (elOffset + elHeight) > viewport)
                        listDiv.scrollTop = elOffset;
                }
                listDiv.addEventListener('mouseenter', function (event) {
                    event.target.classList.add('highlight');
                }).addEventListener('mouseleave', function (event) {
                    event.target.removeClass('highlight');
                });

            })
        }
    }

    onFocusHandler() {
        // Shows list on input focus
        this.setState({
            showListMenu: true
        })
    }
    onBlurHandler() {
        // Hides list on input blur 
        setTimeout(() => {
            this.setState({
                showListMenu: false
            })
        }, 500)
    }
    onClickHandler() {
        // handles click on input field
        this.setState({
            showListMenu: !this.state.showListMenu
        })
    }

    handleInputChange(e) {
        // handles input field change and sets entered the value to state
        if (!isEmpty(e.target)) {
            this.setState({
                inputString: e.target.value,
                showListMenu: true,
                filteredList: this.state.managersList.filter((item) => item.name.replace(/\s/g, '').toLowerCase().includes(e.target.value.replace(/\s/g, '').toLowerCase()))
            })

        }
    }

    handleListItemClick(id) {
        // handles enter press on list item and sets input string to state
        this.setState({
            inputString: get(find(this.state.managersList, ['id', id]), 'name', ''),
            showListMenu: false
        })
    }

    render() {
        const { inputString, filteredList, showListMenu } = this.state;
        return (
            <div className='liveSearch'>
                <input
                    type='text'
                    id='liveSearchInput'
                    placeholder='Choose Manager'
                    className='liveSearch-input'
                    value={inputString}
                    onBlur={this.onBlurHandler}
                    onFocus={this.onFocusHandler}
                    onMouseDown={this.onClickHandler}
                    onChange={this.handleInputChange}
                />
                {
                    showListMenu && <ul className='liveSearch-list' id="managersList">
                        {
                            filteredList.map((item) => <li
                                className='liveSearch-list-item'
                                onClick={() => this.handleListItemClick(item.id)}
                                id={`listItem-${item.id}`}
                                key={item.id}
                                onMouseEnter={(e) => { e.target.classList.add("highlight") }}
                                onMouseLeave={(e) => { e.target.classList.remove("highlight") }}
                            >
                                <p className='liveSearch-list-item-acronym'>{item.name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')}</p>
                                <div className='liveSearch-list-item-content'>
                                    <p className='liveSearch-list-item-content-name'>{item.name}</p>
                                    <p className='liveSearch-list-item-content-email'>{item.email}</p>
                                </div>
                            </li>)
                        }
                    </ul>
                }
            </div>
        )
    }
}

export default LiveSearch;

