import React from 'react'
import {TextField} from 'react-md'
import style  from '../../utility/style'

const KycDetails = (kyc, gender) => {
    return (
        <div>
            <div className="field-container">
                <p style={{ margin: "0px" }}>Name</p>
                <div className="beneficiary-details-textfields">
                    <TextField
                        id="SigninTextfield"
                        style={style.textfield1}
                        disabled
                        defaultValue=""
                        lineDirection="center"
                        type="text"
                        defaultValue={kyc.name}
                    />
                </div>
            </div>
            <div className="field-container">
                <p style={{ margin: "0px" }}>Father's Name</p>
                <div className="beneficiary-details-textfields">
                    <TextField
                        id="SigninTextfield"
                        disabled
                        defaultValue=""
                        style={style.textfield1}
                        lineDirection="center"
                        type="text"
                        defaultValue={kyc.co}
                    />
                </div>
            </div>
            <div className="field-container">
                <p style={{ margin: "0px" }}>Contact Number</p>
                <div className="beneficiary-details-textfields">
                    <TextField
                        id="SigninTextfield"
                        disabled
                        defaultValue=""
                        style={style.textfield1}
                        lineDirection="center"
                        type="text"
                        defaultValue={kyc.phone}
                    />
                </div>
            </div>
            <div className="field-container">
                <p style={{ margin: "0px" }}>Date of Birth</p>
                <div className="beneficiary-details-textfields">
                    <TextField
                        id="SigninTextfield"
                        disabled
                        defaultValue=""
                        style={style.textfield1}
                        lineDirection="center"
                        type="text"
                        defaultValue={kyc.dob}
                    />
                </div>
            </div>
            <div className="field-container">
                <p style={{ margin: "0px" }}>Gender</p>
                <div className="beneficiary-details-textfields">
                    <TextField
                        id="SigninTextfield"
                        disabled
                        defaultValue=""
                        style={style.textfield1}
                        lineDirection="center"
                        type="text"
                        defaultValue={gender}
                    />
                </div>
            </div>
            <div className="field-container">
                <p style={{ margin: "0px" }}>Address</p>
                <div className="beneficiary-details-textarea">
                    <textarea
                        type="text"
                        disabled
                        defaultValue=""
                        id="message"
                        cols="33"
                        rows="3"
                        defaultValue={kyc.house + ", " + kyc.street + ", " + kyc.vtc + ", " + kyc.loc + ", " + kyc.lm + "-" + kyc.subdist + ", " + kyc.dist + ", " + kyc.state + ", " + kyc.po}
                    />
                </div>
            </div>
        </div>
    )
}

export default KycDetails
