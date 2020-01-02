
	var result;
	var _tax_Proration_State_Arr = ['23', '10', '36', '39'];
	var _tax_Proration_State_City_Arr = ['2'];
	var _tax_Proration_State_Utah_Arr = ['45']; // Utah state
	var _tax_Proration_State_Oregon_Arr = ['38']; // Oregon state
	var _michigan_counties_Arr = ['1288', '1312', '1311', '1276', '1293', '1280', '1239', '1255', '1277', '1307', '2291', '2289', '2245', '2252', '2249', '2258', '2266', '2282', '320', '322', '325', '330', '335', '347', '349', '353', '354', '359', '360', '361', '367', '368', '369', '370', '371', '374', '375', '376', '378', '383', '2090', '1274'];
	
	var _illinois_counties_Arr_105 = ['616', '644', '693', '639', '626', '657', '641'];
	var _illinois_counties_Arr_600 = ['597', '601', '608', '620', '625', '636', '650', '661', '662', '673', '689'];
	var _illinois_counties_Arr_110 = ['610'];
	/*
		Calculating amount, adjusted and down payment for VA loan type
		Formula => 	Amount		= funding * SP / 100 + SP
	*/
	export function getSellerAmountVA( request ){
		var amount;	
		var adjusted;
		amount          = request.LTV / 2 * request.salePrice * 1 / 100;
     
		adjusted        = (request.LTV * parseInt(request.salePrice)) / 100 + parseInt(request.salePrice);
     	
		//creating result object
		result = {
			amount		:amount,
			adjusted    :adjusted
     	}; 
		return result;
	}

	/*
		Calculating amount, adjusted and down payment for FHA loan type
		Formula => 	Amount		= SP * LTV / 100
	*/
	export function getSellerAmountFHA( request ){
		var amount;
		var adjusted;
		amount 			= request.salePrice * request.LTV/100;								//Formula applied here to calculate the amount						//calculating down payment
		adjusted        = amount + ((amount * request.MIP) / 100);
     	
		//creating result object
		result = {
			amount		:adjusted,
			adjusted    :adjusted
     	}; 
		return result;
	}

		/*
		Calculating amount, adjusted and down payment for FHA loan type
		Formula => 	Amount		= SP * LTV / 100
	*/
	export function getSellerAmountCONV( request ){
		var amount;
		var adjusted;
		amount 			= request.salePrice * request.LTV/100;								//Formula applied here to calculate the amount						//calculating down payment
		adjusted        = amount + ((amount * request.MIP) / 100);
     	
		//creating result object
		result = {
			amount		:amount,
			adjusted    :adjusted
     	}; 
		return result;
	}

	export function getSellerAmountUSDA( request ) {
		var adjusted;
		adjusted   = (parseFloat(request.salePrice) * parseFloat(request.MIP)) + parseFloat(request.salePrice);
		//creating result object
		result = {
		 adjusted :adjusted
		}; 
		return result;
	}

		/*
		Searching string in transfer tax array
	*/
	export function StrInArray(searchstr,refarr){
		for (key in refarr) {         
			if (refarr[key].hasOwnProperty(searchstr)){
				return refarr[key][searchstr];
			}     
		}
	}

	/*
		Calculating Cost Type Total 
		Formula => 	totalCostRate	= parseFloat(request.rate);							//for flat rate
					totalCostRate	= request.rate * request.salePrice / 100;			//for sale price
					totalCostRate	= request.rate * request.amount / 100;				//for loan
	*/
	export function getNetfirstCostTypeTotal(request){
		
		var totalCostRate;
		console.log(request);
		if(request.type == 'Flat Fee'){
			totalCostRate	= parseFloat(request.rate);
		}
		if(request.type == '% Sale Price'){
			totalCostRate	= request.rate * request.salePrice / 100;
		}
		if(request.type == '% Loan'){
			totalCostRate	= request.rate * request.amount / 100;
		}
		//creating result object
		result = {
			totalCostRate		:totalCostRate.toFixed( 2 )
		}; 
		return result;
	}

	/*
		Calculating Toal Cost Rate 
		Formula => 	totalCostRate	= parseFloat(request.rate);							//for flat rate
					totalCostRate	= request.rate * request.salePrice / 100;			//for sale price
					totalCostRate	= request.rate * request.amount / 100;				//for loan
	*/
	export function getNetfirstTotalCostRate(request){
		
		var totalCostRate;
			
		totalCostRate	= parseFloat(request.cost1) + parseFloat(request.cost2) + parseFloat(request.cost3) + parseFloat(request.cost4) + parseFloat(request.cost5) + parseFloat(request.cost6) + parseFloat(request.cost7) + parseFloat(request.cost8) + parseFloat(request.cost9) + parseFloat(request.cost10);
		//creating result object
		result = {
			totalCostRate		: totalCostRate
		}; 
		return result;
	}
	
	/*
		Calculating agrigate list and sell values 
		Formula => 	resultData	= request.SCC_Brokage_Fee / 2;					
	*/
	export function getNetfirstListSellAgt(request){
		
		var listAgt;
		var sellAgt;
			
		resultData	= request.SCC_Brokage_Fee / 2;
		//creating result object
		result = {
			listAgt		: resultData.toFixed( 2 ),
			sellAgt		: resultData.toFixed( 2 )
		}; 
		return result;
	}

	/*
		Calculating agrigate list and sell values 
		Formula => 	brokerageFee	= request.brokeragePer * request.salePrice / 100;
	*/
	export function getNetfirstListSellAgtValues(request){
		
		var brokerageFee;
			
		brokerageFee	= request.brokeragePer * request.salePrice / 100;
		
		//creating result object
		result = {
			brokerageFee		: brokerageFee.toFixed( 2 )
		}; 
		return result;
	}

	/*
		Calculating agrigate list and sell values 
		brokeragePer	= (request.brokerageFee / request.salePrice) * 100;
	*/
	export function getNetfirstListSellAgtPer(request){
		
		var brokeragePer;

		brokeragePer	= (request.brokerageFee / request.salePrice) * 100;

		//creating result object
		result = {
			brokeragePer		: brokeragePer.toFixed( 2 )
		}; 
		return result;
	}


	
	/*
		Calculating existing balance and rate
		Formula => 	daysInterest	= existing_total / 365 * days;
	*/
	export function getNetfirstExistingBalanceCalculation(request){
		
		var daysInterest;
		console.log(request);	
		existing1	= request.existing_bal1 * request.existing_rate1 / 100;
		existing2	= request.existing_bal2 * request.existing_rate2 / 100;
		existing3	= request.existing_bal3 * request.existing_rate3 / 100;
		
		existing_total	= existing1 + existing2 + existing3;
		totalBalance	= parseFloat(request.existing_bal1) + parseFloat(request.existing_bal2) + parseFloat(request.existing_bal3);
		console.log(existing_total);
		daysInterest	= existing_total / 365 * request.days;
		//creating result object
		result = {
			daysInterest		: daysInterest.toFixed( 2 ),
			existingTotal		: totalBalance
		}; 
		return result;
	}

	/*
		Changing the string to upper case
	*/
	export function StrToUpper(str){
		var words = str.split(' ');
		var arr = [];
		words.filter(function(val){
			arr.push(val.charAt(0).toUpperCase()+ val.substr(1).toLowerCase());             
		})
		// console.log(arr.join(" ").trim());
		return arr.join(" ").trim();
	}
	
	/*
		Calculating discount amount
		Formula => 	discount 	= amount * discountPerc / 100
	*/
	export function getNetfirstDiscountAmount( request ){
		var discount;
		if((request.amount === undefined || request.amount === '') || (request.discountPerc === undefined || request.discountPerc === '')){
			return result = { discount : 0 };
		}
		discount 	= parseInt(request.amount) * parseInt(request.discountPerc)/100 ;		//Formula applied here to calculate the discount amount
		//creating result object
		result = {
			discount		: discount.toFixed( 2 )
		}; 
		return result;

	}	

	//getNetfirstEstimatedTax
	/*
		Calculating discount amount
		Formula => 	discount 	= amount * discountPerc / 100
	*/
	/*export function getNetfirstEstimatedTax( request ){
	
		if(request.date >= '28' && request.month == '2'){
			request.date	= '30';
		}
		if(request.date == '31'){
			request.date	= '30';
		}
		if(request.proration > '0'){
			estimatedPro 		= request.proration - 30 + ( request.date - 1 );
			dailypropertyTax	= request.annualPropertyTax / 360;
			estimatedTax		= estimatedPro * dailypropertyTax.toFixed( 2 );
		}

		if(request.proration < '0'){
			estimatedPro 		= Math.abs(request.proration) - 30 + ( request.date + 1 );
			dailypropertyTax	= request.annualPropertyTax / 360;
			estimatedTax		= estimatedPro * dailypropertyTax.toFixed( 2 );
			estimatedTax		= -Math.abs(estimatedTax);
		}

		if(request.proration == '0'){
			estimatedTax		= Math.abs(request.proration);
		}

		//creating result object
		result = {
			estimatedTax		: estimatedTax.toFixed( 2 )
		}; 
		return result;

	}*/	

	/*export function getNetfirstEstimatedTax( request ){
 
		if (request.date >= '28' && request.month == '2') {
			request.date = '30';
		   }
		   if (request.date == '31') {
			request.date = '30';
		   }
		   estimatedPro = 0;
		   if (request.state_code == 'CA') {
			if (request.proration > '0') {
			 estimatedPro = Math.abs(request.proration) - parseFloat(request.date);
			}
			if (request.proration < '0') {
			 estimatedPro = Math.abs(request.proration) - parseFloat(request.date) + parseFloat(1);
			}
		   } else {
			if (request.proration > '0') {
			 estimatedPro = Math.abs(request.proration) - parseFloat(30) + parseFloat(request.date) - parseFloat(1);
			}
		  
			if (request.proration < '0') {
			 estimatedPro = Math.abs(request.proration) - parseFloat(30) + parseFloat(request.date) + parseFloat(1);
			}
		   }
		  
		   dailypropertyTax = parseFloat(request.annualPropertyTax) / 360;
		   estimatedTax = parseFloat(estimatedPro) * parseFloat(dailypropertyTax).toFixed(2);
		   estimatedTax = Math.abs(estimatedTax);
		  
		   if (request.proration < 0) {
			estimatedTax = 0 - estimatedTax;
		   }
		  
		   //creating result object
		   result = {
			estimatedTax: parseFloat(estimatedTax).toFixed(2)
		   };
		   return result;
	  
	}*/

		   /*
	Calculating Estimated Tax
	Formula => 	estimatedPro 		= request.proration - 30 + ( request.date - 1 );
				dailypropertyTax	= request.annualPropertyTax / 360;
				estimatedTax		= estimatedPro * dailypropertyTax;
*/
export function getNetfirstEstimatedTax(request) {
	current_date = request.closing_date;
	var perDayTax;
	//current_date = current_date.replace(/-/g, "/");
	d1 = new Date(current_date);
	noOfMonth = d1.getMonth();
	year = d1.getFullYear();
	month = noOfMonth + 1;

	var noOfdate = dated = d1.getDate();
	console.log(dated+' = '+month+' = '+year);
	if (dated >= '28' && month == '2') {
		dated = '30';
	}
	if (dated == '31') {
		dated = '30';
	}
	var mon = new Array(12);
	mon[1] = "jan";
	mon[2] = "feb";
	mon[3] = "mar";
	mon[4] = "apr";
	mon[5] = "may";
	mon[6] = "jun";
	mon[7] = "jul";
	mon[8] = "aug";
	mon[9] = "sep";
	mon[10] = "oct";
	mon[11] = "nov";
	mon[12] = "dec";

	current_month = mon[month];
	if (month > 1)
		prev_month = mon[month - 1];
	else
		prev_month = "0";

	var prorationLength = Object.keys(request.proration.data).length;
	var summerProrations = winterProrations = prorations = summer_daysleftinmonth = winter_daysleftinmonth = 0;

	/*for (key in request.proration.data) {
		if (prorationLength == 2) {
			if (request.state_id == 2) {
				if (request.city = key) {
					prorations = request.proration.data[key][current_month];
				}
			} else {
				if (key == 's' || key == 'dnp' || key == 'adv')
					summerProrations = request.proration.data[key][current_month];
				else
					winterProrations = request.proration.data[key][current_month];
			}
		} else {
			prorations = request.proration.data[key][current_month];
		}
	}*/


	for (key in request.proration.data) {
		if (prorationLength == 2) {
		 	if (request.state_id == 2) {
		  		if (request.city = key) {
		   			prorations = request.proration.data[key][current_month];
		  		}
		 	} else {
		  		if (key == 's' || key == 'dnp' || key == 'adv')
		   			summerProrations = request.proration.data[key][current_month];
		  		else
		   			winterProrations = request.proration.data[key][current_month];
		 	}
		} else {
		 	if (request.state_id == 32) {
		  		prorations = request.proration.data[key][prev_month];
		 	} else {
		  		prorations = request.proration.data[key][current_month];
		 	}
		}
	}

	console.log(summerProrations + "  summerProrations");
	console.log(winterProrations + "  winterProrations");
	console.log(prorations + "  prorations");

	console.log("state id " + request.state_id);
	console.log("county id " + request.county_id);
	

	countyCheck = inArray(request.county_id, _michigan_counties_Arr);
	stateCheck = inArray(request.state_id, _tax_Proration_State_Arr);
	stateCityCheck = inArray(request.state_id, _tax_Proration_State_City_Arr);
	stateUtahCheck = inArray(request.state_id, _tax_Proration_State_Utah_Arr);
	stateOregonCheck = inArray(request.state_id, _tax_Proration_State_Oregon_Arr);


	firstQuarterTax = request.summerPropertyTax;
	secondQuarterTax = request.winterPropertyTax;
	annualPropertyTax = request.annualPropertyTax;
	lucasCountyOhioCheck = '';

	//if (stateCheck != -1 && countyCheck !== -1) { // for web
	if (stateCheck != false && countyCheck !== false) { // for mobile
		
		if (request.county_id == 2090) { // Lucas County Ohio
			if (firstQuarterTax > 0 && secondQuarterTax > 0) {
				lucasCountyOhioCheck = 'Only one box can be used.';
				secondQuarterTax = 0;
			}
		}
		if (request.state_id == 10) {
			if (parseFloat(summerProrations) > 0) {
				var daysleftinmonth = Math.abs(summerProrations) - (30 - dated) - 1;
			} else if (parseFloat(summerProrations) == 0.00) {
				var daysleftinmonth = 0;
			} else {
				var daysleftinmonth = Math.abs(summerProrations) - (30 - dated) + 1;
			}
			summer_daysleftinmonth = daysleftinmonth;

			if (parseFloat(winterProrations) > 0) {
				var daysleftinmonth = Math.abs(winterProrations) - (30 - dated) - 1;
			} else if (parseFloat(winterProrations) == 0.00) {
				var daysleftinmonth = 0;
			} else {
				var daysleftinmonth = Math.abs(winterProrations) - (30 - dated) + 1;
			}
			winter_daysleftinmonth = daysleftinmonth;
		} else {
			if (parseFloat(summerProrations) > 0) {
				var daysleftinmonth = Math.abs(summerProrations) - dated - 1; // Debit - proration in positive case
			} else if (parseFloat(summerProrations) == '0.00') {
				var daysleftinmonth = 0;
			} else {
				var daysleftinmonth = Math.abs(summerProrations) - dated + 1; // Credit - proration in negative case
			}
			summer_daysleftinmonth = daysleftinmonth;

			if (parseFloat(winterProrations) > 0) {
				var daysleftinmonth = Math.abs(winterProrations) - dated - 1; // Debit - proration in positive case
			} else if (parseFloat(winterProrations) == '0.00') {
				var daysleftinmonth = 0;
			} else {
				var daysleftinmonth = Math.abs(winterProrations) - dated + 1; // Credit - proration in negative case
			}
			winter_daysleftinmonth = daysleftinmonth;
		}
	//} else if (stateCityCheck != -1) { // Alaska State condition // for web
	} else if (stateCityCheck != false) { // Alaska State condition // for mobile

		if (prorations > 0) {
			var daysleftinmonth = Math.abs(prorations) - (30 - dated) - 1;
		} else if (parseFloat(prorations) == '0.00') {
			var daysleftinmonth = 0;
		} else {
			var daysleftinmonth = Math.abs(prorations) - (30 - dated) + 1;
		}
	//} else if (stateUtahCheck != -1 || stateOregonCheck != -1) { // Utah and Oregon State condition // for web
	} else if (stateUtahCheck != false || stateOregonCheck != false) { // Utah and Oregon State condition // for mobile
		
		if (parseFloat(prorations) > 0) { // Utah state					
			var daysleftinmonth = Math.abs(prorations) - dated - 1; // Debit - proration in positive case
		} else if (parseFloat(prorations) == '0.00') {
			var daysleftinmonth = 0;
		} else {
			var daysleftinmonth = Math.abs(prorations) - dated + 1; // Credit - proration in negative case
		}
	} else if (request.state_id == 29) {  // NEVADA
		if (parseFloat(prorations) > 0) { 					
			var daysleftinmonth = Math.abs(prorations) - dated; // Debit - proration in positive case 						
		} else if (parseFloat(prorations) == '0.00') {
			var daysleftinmonth = 0;
		} else {
			var daysleftinmonth = Math.abs(prorations) - dated; // Credit - proration in negative case
		}
	} else if (request.state_id == 32) {  // New Maxico
		if (prev_month == "0") prorations = '0.00';
		if (parseFloat(prorations) > 0) {
			var daysleftinmonth = Math.abs(prorations) + dated; // Debit - proration in positive case 
		} else if (parseFloat(prorations) == '0.00') {
			var daysleftinmonth = 0;
		} else {
			var daysleftinmonth = Math.abs(prorations) + dated; // Credit - proration in negative case
		}
	} else if (request.state_id == 511233) {  // CA not in use	
		if (parseFloat(prorations) > 0) {
			var daysleftinmonth = Math.abs(prorations) - dated; // Debit - proration in positive case
		} else if (parseFloat(prorations) == '0.00') {
			var daysleftinmonth = 0;
		} else {
			var daysleftinmonth = Math.abs(prorations) - dated + 1; // Credit - proration in negative case
		}
	} else {
		if (parseFloat(prorations) > 0) {
			var daysleftinmonth = Math.abs(prorations) - 30 + (dated - 1); // Debit - proration in positive case	
		} else if (parseFloat(prorations) == '0.00') {
			var daysleftinmonth = 0;
		} else {
			var daysleftinmonth = Math.abs(prorations) - 30 + (dated + 1); // Credit - proration in negative case						
		}
	}

	estimatedTaxProrations = 0;
	//if (stateCheck != -1 && countyCheck !== -1) { // state - '23','10','36','39' // for web
	if (stateCheck != false && countyCheck !== false) { // state - '23','10','36','39' // for mobile
	
		firstQuarter_perDayTax = parseFloat(firstQuarterTax / 360).toFixed(2);;
		secondQuarter_perDayTax = parseFloat(secondQuarterTax / 360).toFixed(2);;

		summerTaxProrations = (firstQuarter_perDayTax * summer_daysleftinmonth);
		winterTaxProrations = (secondQuarter_perDayTax * winter_daysleftinmonth);

		if (summerProrations < 0) summerTaxProrations = 0 - summerTaxProrations;
		if (winterProrations < 0) winterTaxProrations = 0 - winterTaxProrations;
		//console.log("firstQuarter_perDayTax " + firstQuarter_perDayTax)
		//console.log("secondQuarter_perDayTax " + secondQuarter_perDayTax)
		//console.log("summer_daysleftinmonth " + summer_daysleftinmonth)
		//console.log("winter_daysleftinmonth " + winter_daysleftinmonth)
		estimatedTaxProrations = summerTaxProrations + winterTaxProrations;
	} else {

		if (request.state_id == 32 || request.state_id == 17 || request.state_id == 26) {  // New Maxico
			perDayTax = parseFloat(annualPropertyTax) / 365;
		} else if (request.state_id == 13) {  /* Idaho State */
			var noOfDays = new Date(year, noOfMonth + 1, 0).getDate();
			daysleftinmonth = Math.abs(prorations) - (noOfDays - noOfdate);

			console.log("noOfDays = "+noOfDays+", daysleftinmonth = "+daysleftinmonth);
			perDayTax = (annualPropertyTax / 365);
		} else if (request.state_id == 14) {  /* Illinois State */

			//console.log("county_id " + request.county_id);

			//console.log("current_date " + current_date);


			var daysleftinmonth = getIllinoisEstimatedTaxProration(request.county_id, current_date);

			//console.log("daysleftinmonth " + daysleftinmonth);

			// perDayTax = parseFloat(annualPropTax / 365);
			perDayTax = parseFloat(annualPropertyTax * request.prorationPercent / (365 * 100));
		} else {
			perDayTax = parseFloat(annualPropertyTax) / 360;
		}
		perDayTax = perDayTax.toFixed(2);
		estimatedTaxProrations = (perDayTax * parseFloat(daysleftinmonth));
	}


	//console.log("annual prop tax js file 2 " + perDayTax);

	//console.log("est tax prop js file " + estimatedTaxProrations);
	if (prev_month == "0") estimatedTaxProrations = 0 - estimatedTaxProrations;

	if (request.state_id != 14) {  /* Illinois State */
		if (prorations < 0) {
			estimatedTaxProrations = 0 - estimatedTaxProrations;
		}
	}

	//creating result object
	result = {
		estimatedTax: parseFloat(estimatedTaxProrations).toFixed(2),
		lucasCountyOhioCheck: lucasCountyOhioCheck
	};
	return result;

}

	//getNetfirstSumSSC

	/*
		Calculating Total closing cost setting data
		Formula => 	totalPrepaidItems 	= add all request data
	*/
	export function getNetfirstSumSSC(request){
		
		var totalSSCData;
		totalSSCData 		= parseFloat(request.SCC_Drawing_Deed) + parseFloat(request.SCC_Notary) + parseFloat(request.SCC_TransferTax) +	parseFloat(request.SCC_Reconveynce_Fee) + parseFloat(request.SCC_Pest_Control_Report) + parseFloat(request.SCC_Demand_Statement) + parseFloat(request.SCC_Prepayment_Penalty);				//Formula applied here to calculate the Total closing cost data
		
		//creating result object
		result = {
			totalSSCData		: totalSSCData
		}; 
		return result;
	}
	

	export function getTransferTax(request){
        
        var totalSSCData;

        if(request.state == 'CA'){
            if(request.countyId == '223'){
                transferTax = getTransferTaxForSanFrancisco(request.salesprice);
            } else {
                salespriceperthousand = request.salesprice/1000;
                splitpriceperthousand = String(salespriceperthousand).split(".");
                beforeDecimalPart = parseFloat(splitpriceperthousand[0]);
                if(splitpriceperthousand[1])
                {
                    decimalPart = parseFloat("." + splitpriceperthousand[1]);
                } else {
                    decimalPart = parseFloat("0.0");
                }
                if(decimalPart == 0)
                {
                    transferTax = salespriceperthousand * request.transferTaxRate;
                }
                if(decimalPart <= 0.5 && decimalPart > 0)
                {
                    salespriceperthousand = beforeDecimalPart + 0.5;
                    transferTax = salespriceperthousand * request.transferTaxRate;
                }
                if(decimalPart > 0.5)
                {
                    beforeDecimalPart =  beforeDecimalPart + 1;
                    transferTax = beforeDecimalPart * request.transferTaxRate;
                }
            }
        } else {
            transferTax         = request.transferTaxRate * request.salesprice / 1000;
        }   
        
        //creating result object
        result = {
            transferTax     : transferTax.toFixed(2)
        }; 
        return result;
    }

	export function getTransferTaxForSanFrancisco(salesprice)
    {
        //var salesprice = $("#salePrice").val(); 
        salesprice = removeCommas(salesprice);
        var transferTax_val = 0.00;
        if(salesprice <= 250000){ 
            transferTax_val = (salesprice * 5) /1000;
        }else if(salesprice >= 250001 && salesprice <= 999999){
            transferTax_val = (salesprice * 6.80) /1000;
        }else if(salesprice >= 1000000 && salesprice <= 4999999){
            transferTax_val = (salesprice * 7.50) /1000;   
        }else if(salesprice >= 5000000){
            transferTax_val = (salesprice * 15) /1000;
        }
        return transferTax_val;
	}

	function getIllinoisEstimatedTaxProration(countyIdHiddenValue, settlement_date) {
		//settlement_date = closingDate.replace(/-/g, "/");
		var closing_date = new Date(settlement_date);
		var current_year = closing_date.getFullYear();
		var date_from = '';
		console.log("countyIdHiddenValue = " + countyIdHiddenValue);
		console.log("current_year = " + current_year);
		console.log("closingDate = " + settlement_date);
		// For Cook:
		var illinoisCountyCheck110 = inArray(countyIdHiddenValue, _illinois_counties_Arr_110);
	
		console.log("illinoisCountyCheck110 " + illinoisCountyCheck110);
	
		//if (illinoisCountyCheck110 != -1) { // for web
		if (illinoisCountyCheck110 != false) {	// for mobile	
			// If the closing date is 1/1/Current through 3/4/Current, then days = number of days from 12/31/(Current - 2) to the closing date. 
	
			var start_date = new Date(current_year + '/' + 1 + '/' + 1); // YY,MM,DD
			
	
			console.log("strts dt " + start_date);
	
			var start_date = new Date(current_year + '/' + 1 + '/' + 1); // YY,MM,DD
			
			
			
			var end_date = new Date(current_year + '/' + 3 + '/' + 4); // YY,MM,DD
	
	
	
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 2 + '/' + 12 + '/' + 31); // YY,MM,DD
			}
	
			// If the closing date is 3/5/Current through 8/4/Current, then days = the number of days from 6/30/(Current - 1) to the closing date.
			var start_date = new Date(current_year + '/' + 3 + '/' + 5); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 8 + '/' + 4); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 6 + '/' + 30); // YY,MM,DD
			}
			// If the closing date is 8/5/Current through 12/31/Current, then days = the number of days from 12/31/(Current - 1) to the closing date.
			var start_date = new Date(current_year + '/' + 8 + '/' + 5); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 12 + '/' + 31); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 12 + '/' + 31); // YY,MM,DD
			}
		}
	
		//console.log("strt dt 1 " + start_date);
		//console.log("end dt 1 " + end_date);
		//console.log("date form dt 1 " + date_from);
		
		// For DuPage, Grundy, Kane, Kendall, Lake, McHenry, Will:
		var illinoisCountyCheck105 = inArray(countyIdHiddenValue, _illinois_counties_Arr_105);
		//if (illinoisCountyCheck105 != -1) { // for web
		if (illinoisCountyCheck105 != false) {	// for mobile	
			// If the closing date is 1/1/Current through 6/4/Current, then days = number of days from 12/31/(Current - 2) to the closing date.
			var start_date = new Date(current_year + '/' + 1 + '/' + 1); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 6 + '/' + 4); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 2 + '/' + 12 + '/' + 31); // YY,MM,DD
			}
	
			// If the closing date is 6/5/Current through 9/4/Current, then days = the number of days from 6/30/(Current - 1) to the closing date.
			var start_date = new Date(current_year + '/' + 6 + '/' + 5); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 9 + '/' + 4); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 6 + '/' + 30); // YY,MM,DD
			}
			// If the closing date is 9/5/Current through 12/31/Current, then days = the number of days from 12/31/(Current - 1) to the closing date.
			var start_date = new Date(current_year + '/' + 9 + '/' + 5); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 12 + '/' + 31); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 12 + '/' + 31); // YY,MM,DD
			}
		}
		// For Madison:
		if (countyIdHiddenValue == 651) {
			// If the closing date is 1/1/Current through 7/9/Current, then days = number of days from 12/31/(Current - 2) to the closing date.
			var start_date = new Date(current_year + '/' + 1 + '/' + 1); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 7 + '/' + 9); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 2 + '/' + 12 + '/' + 31); // YY,MM,DD
			}
			// If the closing date is 7/10/Current through 9/9/Current, then days = the number of days from 4/1/(Current - 1) to the closing date. 
			var start_date = new Date(current_year + '/' + 7 + '/' + 10); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 9 + '/' + 9); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 4 + '/' + 1); // YY,MM,DD
			}
			// If the closing date is 9/10/Current through 10/9/Current, then days = the number of days from 7/1 /(Current - 1) to the closing date.
			var start_date = new Date(current_year + '/' + 9 + '/' + 10); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 10 + '/' + 9); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 7 + '/' + 1); // YY,MM,DD
			}
			//If the closing date is 10/10/Current through 12/9/Current, then days = the number of days from 9/30/(Current - 1) to the closing date.
			var start_date = new Date(current_year + '/' + 10 + '/' + 10); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 12 + '/' + 9); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 9 + '/' + 30); // YY,MM,DD				
			}
			// If the closing date is 12/10/Current through 12/31/Current, then days = the number of days from 12/31/(Current - 1) to the closing date.
			var start_date = new Date(current_year + '/' + 12 + '/' + 10); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 12 + '/' + 31); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 12 + '/' + 31); // YY,MM,DD				
			}
		}
		// For Saint Clair:
		if (countyIdHiddenValue == 681) {
			// If the closing date is 1/1/Current through 7/14/Current, then days = number of days from 12/31/(Current - 2) to the closing date.
			var start_date = new Date(current_year + '/' + 1 + '/' + 1); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 7 + '/' + 14); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 2 + '/' + 12 + '/' + 31); // YY,MM,DD
			}
			// If the closing date is 7/15/Current through 9/4/Current, then days = the number of days from 6/30/(Current - 1) to the closing date.
			var start_date = new Date(current_year + '/' + 7 + '/' + 15); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 9 + '/' + 4); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 6 + '/' + 30);	//YY,MM,DD
			}
			// If the closing date is 9/5/Current through 12/31/Current, then days = the number of days from 12/31/(Current - 1) to the closing date.
			var start_date = new Date(current_year + '/' + 9 + '/' + 5); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 12 + '/' + 31); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 12 + '/' + 31);	//YY,MM,DD
			}
		}
		// For Bond, Calhoun, Clinton, Fayette, Greene, Jersey, Macoupin, Monroe, Montgomery, Randolph, Washington:
		var illinoisCountyCheck600 = inArray(countyIdHiddenValue, _illinois_counties_Arr_600);
		//if (illinoisCountyCheck600 != -1) { // for web
		if (illinoisCountyCheck600 != false) {	// for mobile	
			// If the closing date is 1/1/Current through 7/29/Current, then days = number of days from 12/31/(Current - 2) to the closing date.
			var start_date = new Date(current_year + '/' + 1 + '/' + 1); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 7 + '/' + 29); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 2 + '/' + 12 + '/' + 31); // YY,MM,DD
			}
			// If the closing date is 7/29/Current through 9/29/Current, then days = the number of days from 6/30/(Current - 1) to the closing date.
			var start_date = new Date(current_year + '/' + 7 + '/' + 29); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 9 + '/' + 29); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 6 + '/' + 30);	//YY,MM,DD
			}
			// If the closing date is 9/29/Current through 12/31/Current, then days = the number of days from 12/31/(Current - 1) to the closing date.
			var start_date = new Date(current_year + '/' + 9 + '/' + 29); // YY,MM,DD
			var end_date = new Date(current_year + '/' + 12 + '/' + 31); // YY,MM,DD
			if (closing_date >= start_date && closing_date <= end_date) {
				var date_from = new Date(current_year - 1 + '/' + 12 + '/' + 31);	//YY,MM,DD
			}
		}
	
	
		console.log("start date " + start_date);
		console.log("end date " + end_date);
		console.log("date form " + date_from);
		
	
		//alert(closing_date+'=='+date_from);
		var daysleftinmonth = 0;
		if (date_from != "") {
			var diff = Math.abs(closing_date.getTime() - date_from.getTime());
			var daysleftinmonth = Math.ceil(diff / (1000 * 60 * 60 * 24));
		}
		//alert(diff+'==='+daysleftinmonth);
		daysleft = 0;
		if (daysleftinmonth) {
			daysleft = daysleftinmonth;
		}
		return daysleft;
	}
	
	export function getGrossCommissionsVal(request){
        
        console.log("request");
        console.log(request);
        var totalAgt = request.totalAgt; // total of sell list_agt
        var countyId = request.countyId;
        //var stateIdHiddenValue = request.stateId;
        var grossCommissionsVal;
        var _New_Mexico_Santa_Fe_Zip_Code = ['87501', '87502', '87503', '87504', '87505', '87506', '87507', '87508', '87509'];
        console.log("_New_Mexico_Santa_Fe_Zip_Code");
        console.log(_New_Mexico_Santa_Fe_Zip_Code);
        zipCodeCheck = inArray(request.zipCode, _New_Mexico_Santa_Fe_Zip_Code);
        console.log("zipCodeCheck");
        console.log(zipCodeCheck);
        if (zipCodeCheck != false) {
            grossCommissionsVal = (totalAgt * 8.3125) / 100;
        } else {
            grossCommissionsVal = (totalAgt * 7) / 100;
        }
        
        if (countyId == "1820") { // SANDOVAL
            grossCommissionsVal = parseFloat(totalAgt) * 8.1875 / 100;
        } else if (countyId == "1795") {  // BERNALILLO
            grossCommissionsVal = parseFloat(totalAgt) * 7.5 / 100;
        } else if (countyId == "1802") { // DONA ANA
            grossCommissionsVal = parseFloat(totalAgt) * 8.4375 / 100;
        } else if (countyId == "1821") {  // SANTA FE
            grossCommissionsVal = parseFloat(totalAgt) * 8.9375 / 100;
        } else if (countyId == "1822") {  // SIERRA
            grossCommissionsVal = parseFloat(totalAgt) * 8.5000 / 100;
        } else if (countyId == "1827") {  // VALENCIA
            grossCommissionsVal = parseFloat(totalAgt) * 8.3125 / 100;
        }
        console.log("grossCommissionsVal");
        console.log(grossCommissionsVal);

        commissionsTax = parseFloat(grossCommissionsVal);

        //creating result object
        result = {
            commissionsTax      : commissionsTax.toFixed( 2 )
        }; 
        return result;
	}

	export function getNetfirstGrossCommissionsVal(request){
        
        console.log("request");
        console.log(request);
        var totalAgt = request.totalAgt; // total of sell list_agt
        var countyId = request.countyId;
        //var stateIdHiddenValue = request.stateId;
        var grossCommissionsVal;
        var _New_Mexico_Santa_Fe_Zip_Code = ['87501', '87502', '87503', '87504', '87505', '87506', '87507', '87508', '87509'];
        console.log("_New_Mexico_Santa_Fe_Zip_Code");
        console.log(_New_Mexico_Santa_Fe_Zip_Code);
        zipCodeCheck = inArray(request.zipCode, _New_Mexico_Santa_Fe_Zip_Code);
        console.log("zipCodeCheck");
        console.log(zipCodeCheck);
        if (zipCodeCheck != false) {
            grossCommissionsVal = (totalAgt * 8.3125) / 100;
        } else {
            grossCommissionsVal = (totalAgt * 7) / 100;
        }
        
        if (countyId == "1820") { // SANDOVAL
            grossCommissionsVal = parseFloat(totalAgt) * 8.1875 / 100;
        } else if (countyId == "1795") {  // BERNALILLO
            grossCommissionsVal = parseFloat(totalAgt) * 7.9 / 100;
        } else if (countyId == "1802") { // DONA ANA
            grossCommissionsVal = parseFloat(totalAgt) * 8.4375 / 100;
        } else if (countyId == "1821") {  // SANTA FE
            grossCommissionsVal = parseFloat(totalAgt) * 8.9375 / 100;
        } else if (countyId == "1822") {  // SIERRA
            grossCommissionsVal = parseFloat(totalAgt) * 8.5000 / 100;
        } else if (countyId == "1827") {  // VALENCIA
            grossCommissionsVal = parseFloat(totalAgt) * 8.3125 / 100;
        }
        console.log("grossCommissionsVal");
        console.log(grossCommissionsVal);

        commissionsTax = parseFloat(grossCommissionsVal);

        //creating result object
        result = {
            commissionsTax      : commissionsTax.toFixed( 2 )
        }; 
        return result;
	}
	
	function inArray(searchstr,refarr){

		var count=refarr.length;
		for(var i=0;i<count;i++)
		{
			//console.log("refarr[i] " + refarr[i]);
			//console.log("searchstr " + searchstr);
			if(refarr[i]==searchstr){
				return true;
			}
		}
		return false;
		/*for (key in refarr) {         
			if (refarr[key].hasOwnProperty(searchstr)){
				return refarr[key][searchstr];
			}     
		}*/
	}