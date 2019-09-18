import React from 'react'
import {Button} from 'react-md'
import Dialog from 'react-md/lib/Dialogs'
import keys from '../../models/localStorage-keys'
import store from '../../utility/store'
import style from '../../utility/style'
import storage from '../../utility/encrypt_data'
import language from '../../config/config'

export default class SelectLanguage extends React.Component {
    constructor() {
        super()
        this.state = { visible: true };
    }

    openDialog = () => {
        this.setState({ visible: true });
    }

    closeDialog = () => {
        this.setState({ visible: false });
        store.dispatch({
            type: "CLOSE_LANGUAGE_DIALOG",
            value: ""
        })
    }
    selectLanguage(value, label) {
        let lang = { code: value, language: label }
        storage.setItemValue(keys.USER_PREFERENCE.LANGUAGE, JSON.stringify(lang))
        storage.removeItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT)
        storage.removeItemValue(keys.USER_PREFERENCE.CURRENT_STATE)
        storage.removeItemValue(keys.APP_PREFERENCE.ALL_DISTRICTS)
        storage.removeItemValue(keys.APP_PREFERENCE.SERVICE_LIST_ALL)
        this.setState({ visible: false });
        if (window.location.pathname === "/") {
            store.dispatch({
                type: "CLOSE_LANGUAGE_DIALOG",
                value: ""
            })
        }
        else {
            window.location.href = "/"
        }
    }
    render() {

        let langData = [
            {
                label: "English",
                color: "#808080",
                value: "en",
                family: "Montserrat"
            },
            {
                label: "தமிழ்",
                color: "#808080",
                value: "ta",
                family: "Montserrat"
            },
            {
                label: "తెలుగు",
                color: "#808080",
                value: "te",
                family: "Montserrat"
            },
            {
                label: "हिंदी",
                color: "#808080",
                value: "hi",
                family: "Montserrat"
            },
            {
                label: "ಕನ್ನಡ",
                color: "#808080",
                value: "kn",
                family: "Montserrat"
            },
            {
                label: "മലയാളം",
                color: "#808080",
                value: "ml",
                family: "Montserrat"
            },
            {
                label: "اردو",
                color: "#808080",
                value: "ur",
                family: "Montserrat"
            },
            {
                label: "বাঙালি",
                color: "#808080",
                value: "bn",
                family: "Montserrat"
            },
            {
                label: "नेपाली",
                color: "#808080",
                value: "ne",
                family: "Montserrat"
            },
            {
                label: "मराठी",
                color: "#808080",
                value: "mr",
                family: "Montserrat"
            },
            {
                label: "ਪੰਜਾਬੀ",
                color: "#808080",
                value: "pa",
                family: "Montserrat"
            },
            {
                label: "ગુજરાતી",
                color: "#808080",
                value: "gu",
                family: "Montserrat"
            },
        ]
        return (
            <div>
                <Dialog
                    id="language-modal"
                    visible={this.state.visible}
          					title=""
                    onHide={(() => { })}
                    dialogStyle={style.stateDialog.dialogStyle}
                    style={style.language.container}
                    className="state-dist-modal"
                    focusOnMount={false}
                >
                    {
                        storage.getItemValue(keys.USER_PREFERENCE.LANGUAGE) ?
                            <div className="dialog-back-btn">
                                <Button icon onClick={this.closeDialog.bind(this)}>close</Button>
                            </div> : null
                    }

                    <div className="language-dialog-header">
                        <h4>{language.convert["83dad8107f9459efe2b4fabcf5b63108"]}</h4>
                    </div>
                    <div className="select-language-text">
                        <h3 dangerouslySetInnerHTML={{ __html: language.donot['9e88af2f070358daa6b7a4ae4f1eedd3'] }}></h3>
                    </div>
                    <div className="language-container">
                        <div className="md-grid text-align-center">
                            {
                                langData.map((item) => {
                                    return (

                                        <div className="md-cell--4">
                                            <ul>
                                                <li style={{ color: item.color, fontFamily: item.family }}><span onClick={this.selectLanguage.bind(this, item.value, item.label)}>{item.label}</span></li>
                                            </ul>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}
