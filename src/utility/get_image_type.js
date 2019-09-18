import React from 'react'
import storage from './encrypt_data'
import keys from '../models/localStorage-keys'
import _ from 'lodash'
import png from '../img/png.svg'
import jpg from '../img/jpg.svg'
import pdf from '../img/pdf.svg'

const get_image_type = (name) => {
    if (_.includes(name, '.jpg')) {
        return (
            <img src={jpg} alt="doc" />
        )
    }
    else if (_.includes(name, '.pdf')) {
        return (
            <img src={pdf} alt="doc" />
        )
    }
    else if (_.includes(name, '.png')) {
        return (
            <img src={png} alt="doc" />
        )
    }
  }

export default get_image_type;
