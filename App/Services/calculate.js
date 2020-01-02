// Method to validate email-address
export function calculate(aval,bval){
	  if(aval == ''){
		aval = '0';  
	  }
	  if(bval == ''){
		bval = '0';   
	  }
      var re = parseFloat(aval) + parseFloat(bval);
      return re;
}
