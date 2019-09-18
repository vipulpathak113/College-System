import React from 'react'
import Button from 'react-md/lib/Buttons/Button';


export default class RejectedDialog extends React.Component{
    constructor(){
        super()
    }
    render(){
        return(
            <div>
                <div className="rejected-reason-textarea">
                    <textarea
                        type="text"
                        defaultValue=""
                        id="address"
                        placeholder="Write Reason here"
                        cols="33"
                        rows="3"
                        className="non-monetary-address-textarea"
                    />
                </div>
                <div>
                    <Button label="Done" flat  className="reject-messgage-done-btn"/>
                </div>
            </div>
        )
    }
}