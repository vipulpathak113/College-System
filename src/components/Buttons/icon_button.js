import React from 'react'
import {Button} from 'react-md'

const IconButton =(props) => {
    return(
        <div>
            <Button {...props}>{props.displayName}</Button>
        </div>
    )
}
export default IconButton