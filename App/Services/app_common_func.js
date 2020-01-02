	var result;
	/*
		Calculating final esitmated seller net upto two decimal point
		Formula => 	val.toFixed(2)
	*/
	export function getUptoTwoDecimalPoint( value ){
		var val;
		val = parseFloat(value);
		val = val.toFixed(2);
		
		//creating result object
		result = {
			val	: val,
		}; 
		
		return result;
	}