import React, { Component } from 'react';
import { Popup, Dropdown, Input } from 'semantic-ui-react';
import css from './AdvanceSearchDropdown.css';

export class AdvanceSearchDropdown extends Component {

    constructor(){
        super();
        this.state={
            popupWidth: 100,
            open: false
        }
    }


    componentDidMount(){
        const element = document.getElementById('trigger_advance');
      
        this.setState({ popupWidth: element.offsetWidth})
        window.addEventListener('resize', () => {
            const element1 = document.getElementById('trigger_advance');
            this.setState({ popupWidth: element1.offsetWidth })
        })
       
    }

    render() {
        const { options } = this.props;
        const { popupWidth, open } = this.state;

        return (
            <Popup
                on="click"
                open={open}
                size="large"
                onClose={() => this.setState({ open: false })}
                className={css.advanceSearchDropdown}
                position="bottom center" trigger={
                    <div onClick={() => {
                        this.setState({ open: true })
                    }} >
                        <Input id="trigger_advance" className={`${css.inputTrigger} ${open ? css.customTrigger :''}`} />
                    </div>
                }>
                <Popup.Content>
                    <Dropdown.Menu style={{ width: popupWidth - 2}} className={css.dropdownContent} scrolling>
                        {options.map(option => {
                            return <Dropdown.Menu>
                                {option.text}
                            </Dropdown.Menu>
                        })}
                    </Dropdown.Menu>
                </Popup.Content>

            </Popup>
        );
    }
}
