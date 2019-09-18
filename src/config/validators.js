import language from './config'

var validators = {
    REQUIRED: {re: '*', message: language.convert['9303c9bd4f8178680dc382adbfcd62af']},
    AZ_DASH09:[
        {re: /^[\/,_\-\w\s]+$/, message: language.convert['2f644b4a27e68f505c4f4ac2ffe3a8ac']}
    ],
    NAME:[
    	{re: /^[\w\s]+$/, message: language.convert['562d3d08919ae105c3ebc42d9607d266']},
    	{re: /^(?=.{0,100}$)[\w\s]+$/, message: language.convert['dc3257886ddd291a47fe5c2916b4603a']}
    ],
    CONTACTNUMBER:[
    	{re: /^[\d]+$/, message: language.convert['7c58cde3b827bc7d57cbf77865046169']},
    	{re: /^(?=.{10}$)[\d]+$/, message: language.convert['544b0264d55a1e4cf476b279240d9be4']}
    ],
	ZIPCODE:[
    	{re: /^[\d]+$/, message: language.convert['7c58cde3b827bc7d57cbf77865046169']},
    	{re: /^(?=.{6}$)[\d]+$/, message: language.convert['c6f91b305e91a0053748310de170a73c']}
    ],
	EMAIL:[
        {re: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: language.convert['9f44bd93c8988c682d5ef5369fd11f47']}
  	]
}

export default validators;
