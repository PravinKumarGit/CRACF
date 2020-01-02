
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
		Calculating amount, adjusted and down payment for FHA loan type
		Formula => 	Amount		= SP * LTV / 100
				   	Adjusted 	= amount + (amount * MIP / 100)					
					DownPayment = SP - Amount
	*/
	export function getAmountFHA( request ){
		var amount;
		amount 			= request.salePrice * request.LTV/100;								//Formula applied here to calculate the amount
		adjusted 		= parseInt(amount) + parseInt( parseInt(amount) * request.MIP/100 );		//Formula applied here to calculate the adjusted
		downPayment 	= request.salePrice - parseInt(amount);								//calculating down payment
		
		//creating result object
		result = {
			amount		:parseFloat(amount).toFixed(2),
			adjusted	:parseFloat(adjusted).toFixed(2),
			downPayment	:parseFloat(downPayment).toFixed(2)
		}; 
		return result;
	}

	/*
		Calculating amount and down payment for Conventional loan type
		Formula => 	Amount 		= SP * LTV / 100
					DownPayment = SP - Amount
	*/
	/*export function getAmountConventional( request ){
		var amount, amount2;
		amount 			= request.salePrice * request.LTV/100;				//Formula applied here to calculate the amount
		downPayment 	= request.salePrice;
		amount2			= 0;
		//console.log(request.LTV2);
		if(request.LTV2 > 0){
			//console.log("in condition = " + request.LTV2);
			amount2 		= request.salePrice * request.LTV2/100;				//Formula applied here to calculate the amount
			downPayment 	= downPayment - amount2;						//calculating down payment
		}

		downPayment 	= downPayment - amount;						//calculating down payment
		
		//creating result object
		result = {
			amount		: parseFloat(amount).toFixed(2),
			amount2		: parseFloat(amount2).toFixed(2),
			downPayment	: parseFloat(downPayment).toFixed(2)
		}; 
		return result;
	}*/

	export function getAmountConventional( request ){
		var amount, amount2;
		amount 			= request.salePrice * request.LTV/100;				//Formula applied here to calculate the amount
		downPayment 	= request.salePrice;
		amount2			= 0;
		
		if(request.LTV2 > 0){
			
			amount2 		= request.salePrice * request.LTV2/100;				//Formula applied here to calculate the amount
			downPayment 	= downPayment - amount2;						//calculating down payment
		}

		downPayment 	= downPayment - amount;						//calculating down payment
	
		
		ltv1 = request.LTV;

		if (request.dp_request > 0) {
		  amount = request.salePrice - request.dp_request;
		  if (request.LTV2 > 0) {
			amount = amount - amount2;
		  }
		  downPayment = request.dp_request;
		  ltv1 = (amount / request.salePrice) * 100;
		}

		//creating result object
		result = {
			amount		:parseFloat(amount).toFixed( 2 ),
			amount2		:parseFloat(amount2).toFixed( 2 ),
			downPayment	:parseFloat(downPayment).toFixed( 2 ),
			ltv1: parseFloat(ltv1).toFixed(2)
		}; 
		return result;
	}

	/*
		Calculating adjusted amount for VA loan type
		Formula => 	Adjusted 	= amount + (amount * FF / 100)					
	*/
	export function getAdjustedVA( request ){
		var adjusted;
		//console.log(request);
		adjusted 	= parseInt(request.salePrice) + ( parseInt(request.salePrice) * request.FF/100 );		//Formula applied here to calculate the adjusted

		//creating result object
		result = {
			amount		:parseFloat(request.salePrice).toFixed( 2 ),
			adjusted	:parseFloat(adjusted).toFixed( 2 ),
			downPayment	:'0.00'
		}; 
		return result;
		//return adjusted;

	}
	/*
		Calculating adjusted amount for USDA loan type
		Formula => 	Adjusted 	= amount + (amount * MIP )					
	*/
	export function getAdjustedUSDA( request ){
		var adjusted;

		adjusted 	= parseInt(request.salePrice) + ( parseInt(request.salePrice) * request.MIP );		//Formula applied here to calculate the Adjusted

		//creating result object
		result = {
			amount		:parseFloat(request.salePrice).toFixed( 2 ),
			adjusted	:parseFloat(adjusted).toFixed( 2 ),
			downPayment	:'0.00'
		}; 
		return result;

	}
	/*
		Calculating discount amount
		Formula => 	discount 	= amount * discountPerc / 100
	*/
	export function getDiscountAmount( request ){
		var discount;
		if((request.amount === undefined || request.amount === '') || (request.discountPerc === undefined || request.discountPerc === '')){
			return result = { discount : 0 };
		}
		discount 	= parseInt(request.amount) * parseInt(request.discountPerc)/100 ;		//Formula applied here to calculate the discount amount
		//creating result object
		result = {
			discount		:parseFloat(discount).toFixed( 2 )
		}; 
		return result;

	}
	/*
		Calculating origination fee
		Formula => 	originationFee 	= amount * origination fee percentage / 100
	*/
	export function getOriginationFee( request ){
		var originationFee;
		if(request.amount2 > 0){
			request.amount = parseInt(request.amount) + parseInt(request.amount2)
		}

		originationFee 	= parseInt(request.amount) * parseInt(request.originationFee)/100 ;		//Formula applied here to calculate the origination Fee
		
		//creating result object
		result = {
			originationFee		:parseFloat(originationFee).toFixed( 2 )
		}; 
		return result;

	}
	/*
		Calculating Prepaid Monthly Tax
		Formula => 	prepaidMonthTaxes	= (Sales Price * Monthly tax rate/12) * Months / 100 
		
	*/
	// Commented by lovedeep as per discussion with vinod sir

	/*export function getPreMonthTax( request ){
        var prepaidMonthTaxes = '0.00';     
        
        if(request.stateId == 6) {          //check for state colorado
            if(request.annualPropertyTax > 0 && request.months >= 0){
                var monthlyTax = request.annualPropertyTax / 12;
                prepaidMonthTaxes =     monthlyTax * request.months;
            }
        } else {
            prepaidMonthTaxes   = (parseInt(request.salePrice) * request.monthlyTax/12) * parseInt(request.months)/100 ;        //Formula applied here to calculate the prepaid month tax
        }

        //creating result object
        result = {
            prepaidMonthTaxes       : parseFloat(prepaidMonthTaxes).toFixed( 2 )
        }; 
        return result;

	}*/

	// Commented by lovedeep as per discussion with vinod sir

	/*export function getPreMonthTax( request ){
		var prepaidMonthTaxes = '0.00';
		if (request.months > 0 && request.monthlyTax > 0) {
			prepaidMonthTaxes = (((request.salePrice * request.monthlyTax) / 12) * request.months) / 100;
		}
	
		result = {
			prepaidMonthTaxes: parseFloat(prepaidMonthTaxes).toFixed(2)
		};
		return result;
	
	}*/

	// Added by lovedeep as per discussion with vinod sir

	export function getPreMonthTax(request) {
		//var prepaidMonthTaxes = '0.00';  
		
		if (request.stateId == 6 || request.AnnualPropertyCheck == true) { //check for state colorado
			if (request.annualPropertyTax > 0 && request.months >= 0) {
			var monthlyTax = request.annualPropertyTax / 12;
			prepaidMonthTaxes = monthlyTax * request.months;
			} else {
			prepaidMonthTaxes = (parseInt(request.salePrice) * request.monthlyTax / 12) * parseInt(request.months) / 100; //Formula applied here to calculate the prepaid month tax
			}
		} else {
			prepaidMonthTaxes = (parseInt(request.salePrice) * request.monthlyTax / 12) * parseInt(request.months) / 100; //Formula applied here to calculate the prepaid month tax
		}
		
		//creating result object
		result = {
			prepaidMonthTaxes: parseFloat(prepaidMonthTaxes).toFixed(2)
		};
		return result;
		
		}

	/*
		Calculating Real Estate Taxes
		Formula => 	realEstateTaxes	= monthlyInsurance / months		
	*/
	export function getRealEstateTaxes( request ){
		var realEstateTaxes;
		realEstateTaxes 	= (request.prepaidMonthTaxesRes / request.months);		//Formula applied here to calculate the Real Estate Taxes
		
		//creating result object
		result = {
			realEstateTaxes		:parseFloat(realEstateTaxes).toFixed( 2 )
		}; 
		return result;

	}

	/*
		Calculating monthly insurance
		Formula => 	monthlyInsurance	= (Sales Price * 4 / 12) * 15 / 1000 
		
	*/
	export function getMonthlyInsurance( request ){
		var monthInsurance;
		
		monthInsurance 	= (parseInt(request.salePrice) * request.insuranceRate/12) * request.months/1000 ;		//Formula applied here to calculate the monthly insurance
		
		//creating result object
		result = {
			monthInsurance		: parseFloat(monthInsurance).toFixed(2)
		}; 
		return result;

	}

	/*
		Calculating Homw Owner insurance
		Formula => 	monthlyInsurance	= monthInsuranceRes / months 
		
	*/
	export function getHomeOwnerInsurance( request ){
		var homeOwnerInsuranceRes;
		//console.log(request);
		homeOwnerInsuranceRes 	= (parseFloat(request.monthInsuranceRes) / parseFloat(request.months)) ;		//Formula applied here to calculate the monthly Homw Owner insurance
		//console.log(homeOwnerInsuranceRes);
		//creating result object
		result = {
			homeOwnerInsuranceRes		: parseFloat(homeOwnerInsuranceRes).toFixed( 2 )
		}; 
		return result;

	}

	/*
		Calculating Tax & Insurance
		Formula => 	monthlyInsurance	= realEstateTaxesRes + homeOwnerInsuranceRes 
		
	*/
	export function getAdjustmentTaxInt( request ){
		var adjustmentTaxIntRes;
		
		adjustmentTaxIntRes 	= (parseFloat(request.homeOwnerInsuranceRes) + parseFloat(request.realEstateTaxesRes)) ;		//Formula applied here to calculate the monthly Homw Owner insurance
		//console.log(adjustmentTaxIntRes);
		//creating result object
		result = {
			adjustmentTaxIntRes		: parseFloat(adjustmentTaxIntRes).toFixed(2)
		}; 
		return result;

	}
	
	/*
		Calculating days interest
		Formula => 	monthlyInsurance	=  (Adjusted * Interest rate / 360) * days / 100
		
	*/
	export function getDailyInterest( request ){
		var daysInterest;
		console.log(request);
		daysInterest 	= (parseFloat(request.adjusted) * parseFloat(request.interestRate) / 360) * parseFloat(request.days)/100 ;		//Formula applied here to calculate the days interest
		
		//creating result object
		result = {
			daysInterest		:parseFloat(daysInterest).toFixed( 2 )
		}; 
		//console.log(result);
		return result;

	}

	/*
		Calculating FHa MIP Finance for Prepaid section
		Formula => 	FhaMipFin	=  salePrice * MIP / 100
		
	*/
	export function getFhaMipFinance( request ){
	
		var FhaMipFin, FhaMipFin1, FhaMipFin2;
		FhaMipFin		= request.salePrice * request.MIP/100;								//Formula applied here to calculate the FhaMipFin
		FhaMipFin 		= parseFloat(FhaMipFin).toFixed( 2 );
		var res 		= FhaMipFin.split(".");
		FhaMipFin1		= res[0] + ".00";
		FhaMipFin2		= "0." + res[1];
		//creating result object
		result = {
			FhaMipFin		:FhaMipFin,
			FhaMipFin1		:FhaMipFin1,
			FhaMipFin2		:FhaMipFin2,
		}; 
		return result;

	}
	/*
		Calculating VA Funding Finance for prepaid section
		Formula => 	VaFfFinance 	= amount * FF / 100
	*/
	/*export function getVaFundingFinance( request ){
		var VaFfFin, VaFfFin1, VaFfFin2;
		//console.log(request);
		VaFfFin 		= parseInt(request.salePrice) * request.FF/100 ;				//Formula applied here to calculate the VaFfFin
		VaFfFin 		= parseFloat(VaFfFin).toFixed( 2 );
		var res 		= VaFfFin.split(".");
		VaFfFin1		= res[0] + ".00";
		VaFfFin2		= "0." + res[1];

		//creating result object
		result = {
			VaFfFin		:VaFfFin,
			VaFfFin1	:VaFfFin1,
			VaFfFin2	:VaFfFin2
		}; 
		return result;
		//return adjusted;

	}*/

	export function getVaFundingFinance(request) {
		var VaFfFin, VaFfFin1, VaFfFin2;
		amount = parseInt(request.amount);
		//salePrice = parseInt(request.salePrice);
	  
		VaFfFin = (amount * parseFloat(request.FF)) / 100; //Formula applied here to calculate the VaFfFin
		VaFfFin = parseFloat(VaFfFin).toFixed(2);
		var res = VaFfFin.split(".");
		VaFfFin1 = "0.00";
		VaFfFin2 = "0.00";
	  
		if (request.VA_RoundDownMIP == "Y") {
		  VaFfFin1 = res[0] + ".00";
		  if (res[1]) VaFfFin2 = "0." + res[1];
		} else {
		  VaFfFin2 = VaFfFin;
		}
	  
		if (request.isfinanceVAMip == true) {
		  adjusted = amount + parseFloat(VaFfFin1);
		} else {
		  VaFfFin1 = "0.00";
		  VaFfFin2 = VaFfFin;
		  adjusted = amount;
		}
		adjusted = amount + parseFloat(VaFfFin1);
	  
		//creating result object
		result = {
		  adjusted: adjusted,
		  VaFfFin: VaFfFin,
		  VaFfFin1: VaFfFin1,
		  VaFfFin2: VaFfFin2
		};
	  
		return result;
	  }

	/*
		Calculating USDA MIP Finance for prepaid section
		Formula => 	UsdaMipFinance 	= amount * FF / 100
	*/
	export function getUsdaMipFinance( request ){
		var UsdaMipFinance, UsdaMipFinance1, UsdaMipFinance2;
		//console.log(request);
		UsdaMipFinance 		= parseInt(request.salePrice) * request.MIP/100 ;				//Formula applied here to calculate the UsdaMipFinance
		UsdaMipFinance 			= parseFloat(UsdaMipFinance).toFixed( 2 );
		var res 			= UsdaMipFinance.split(".");
		UsdaMipFinance1			= res[0] + ".00";
		UsdaMipFinance2			= "0." + res[1];

		//creating result object
		result = {
			UsdaMipFinance		:UsdaMipFinance,
			UsdaMipFinance1		:UsdaMipFinance1,
			UsdaMipFinance2		:UsdaMipFinance2
		}; 
		return result;
		//return adjusted;

	}

	/*
		Calculating annual adjustments
		Formula => 	
	*/
	export function getAnnualAdjustment( request ){
		var amount, interestRate, termsInYear, interestRateCap, perAdjustment, rate;

		amount			= request.amount;
		interestRate	= request.interestRate; 
		termsInYear		= request.termsInYear
		interestRateCap	= request.interestRateCap;
		perAdjustment	= request.perAdjustment;
		adjustments		= [];

		for(var i = 1; i <= 5; i++){
			interestRate  = parseFloat(perAdjustment) + parseFloat(interestRate);
			adjustments.push(sumOfAdjustment(amount, interestRate, termsInYear));
			
		}
		//console.log(adjustments[0]);

		//creating result object
		result = {
			adjustment1	:parseFloat(adjustments[0]).toFixed( 2 ),
			adjustment2	:parseFloat(adjustments[1]).toFixed( 2 ),
			adjustment3	:parseFloat(adjustments[2]).toFixed( 2 ),
			adjustment4	:parseFloat(adjustments[3]).toFixed( 2 ),
			adjustmentN	:parseFloat(adjustments[4]).toFixed( 2 )
		}; 
		return result;
		
		
	}

	export function sumOfAdjustment(amount, interestRate, termsInYear){
		
		sum1 = interestRate/1200;
		sum2 = sum1 + 1;
		sum3 = termsInYear * 12;
		sum4 = Math.pow(sum2, sum3);

		printRate = '0.00';
		if(amount != 0 && sum1 != 0 && sum3 !=0){
			
        	printRate = (amount * (sum1 * sum4)) / (sum4 - 1);
        	printRate = printRate.toFixed(2);
		}
		return printRate;
	}

	/*
		Calculating Monthly Rate MMI
		Formula => 	monthlyRateMMI 	= amount * rateValue / 12 * 100
	*/
	export function getMonthlyRateMMI(request){
		
		var monthlyRateMMI;
		
		monthlyRateMMI 		= (parseFloat(request.amount) * parseFloat(request.rateValue)) / (12 * 100) ;				//Formula applied here to calculate the UsdaMipFinance
	
		//creating result object
		result = {
			monthlyRateMMI	: parseFloat(monthlyRateMMI).toFixed(2),
			monthPmiVal		: parseFloat(monthlyRateMMI * 2).toFixed(2)
		}; 
		return result;
	}


	/*
		Calculating Total Prepaid Items
		Formula => 	totalPrepaidItems 	= add all request data
	*/
	export function getTotalPrepaidItems(request){
		
		var totalPrepaidItems;
		totalPrepaidItems 		= parseFloat(request.prepaidMonthTaxesRes) + parseFloat(request.monthInsuranceRes) + parseFloat(request.daysInterestRes) + parseFloat(request.financialVal);				//Formula applied here to calculate the Total Prepaid Items
		
		//creating result object
		result = {
			totalPrepaidItems		: parseFloat(totalPrepaidItems).toFixed(2)
		}; 
		return result;
	}

	/*
		Calculating Total Monthly Payment
		Formula => 	totalMonthlyPayment 	= add all request data
	*/
	export function getTotalMonthlyPayment(request){
		
		var totalMonthlyPayment;
		totalMonthlyPayment 		= parseFloat(request.principalRate) + parseFloat(request.realEstateTaxesRes) + parseFloat(request.homeOwnerInsuranceRes) + parseFloat(request.monthlyRate) + parseFloat(request.pnintrate) + parseFloat(request.paymentAmount1) + parseFloat(request.paymentAmount2);;				//Formula applied here to calculate the Total Prepaid Items
		
		//creating result object
		result = {
			totalMonthlyPayment		: parseFloat(totalMonthlyPayment).toFixed( 2 )
		}; 
		return result;
	}
	
	/*
		Calculating Total Investment
		Formula => 	totalInvestment 	= add all request data
	*/
	export function getTotalInvestment(request){
		
		var totalInvestment;
		//console.log(request);
		totalInvestment 		= parseFloat(request.downPayment) + parseFloat(request.totalClosingCost) +  parseFloat(request.estimatedTaxProrations) + parseFloat(request.totalPrepaidItems) ;				//Formula applied here to calculate the Total Prepaid Items
		//console.log(totalInvestment);
		//creating result object
		result = {
			totalInvestment		: parseFloat(totalInvestment).toFixed( 2 )
		}; 
		return result;
	}

	/*
		Calculating Cost Type Total 
		Formula => 	totalCostRate	= parseFloat(request.rate);							//for flat rate
					totalCostRate	= request.rate * request.salePrice / 100;			//for sale price
					totalCostRate	= request.rate * request.amount / 100;				//for loan
	*/
	export function getCostTypeTotal(request){
		
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
			totalCostRate		: parseFloat(totalCostRate).toFixed( 2 )
		}; 
		return result;
	}
	/*
		Calculating Toal Cost Rate 
		Formula => 	totalCostRate	= parseFloat(request.rate);							//for flat rate
					totalCostRate	= request.rate * request.salePrice / 100;			//for sale price
					totalCostRate	= request.rate * request.amount / 100;				//for loan
	*/
	export function getTotalCostRate(request){
		
		var totalCostRate;
			
		totalCostRate	= parseFloat(request.cost1) + parseFloat(request.cost2) + parseFloat(request.cost3) + parseFloat(request.cost4) + parseFloat(request.cost5) + parseFloat(request.cost6) + parseFloat(request.cost7) + parseFloat(request.cost8) + parseFloat(request.cost9) + parseFloat(request.cost10);
		//creating result object
		result = {
			totalCostRate		: parseFloat(totalCostRate).toFixed( 2 )
		}; 
		return result;
	}
	
	/*
		Calculating Estimated Tax
		Formula => 	estimatedPro 		= request.proration - 30 + ( request.date - 1 );
					dailypropertyTax	= request.annualPropertyTax / 360;
					estimatedTax		= estimatedPro * dailypropertyTax;
	*/
	/*export function getBuyerEstimatedTax( request ){
	
        if(request.date >= '28' && request.month == '2'){
            request.date    = '30';
        }
        if(request.date == '31'){
            request.date    = '30';
        }
        if(request.proration > '0'){
            estimatedPro         = Math.abs(request.proration) - 30 + ( parseFloat(request.date) - 1 );
            dailypropertyTax    = parseFloat(request.annualPropertyTax) / 360;
            estimatedTax        = parseFloat(estimatedPro) * parseFloat(dailypropertyTax).toFixed( 2 );
            estimatedTax        = Math.abs(estimatedTax);
        }

        if(request.proration < '0'){
            estimatedPro         = Math.abs(request.proration) - parseFloat(30) + ( parseFloat(request.date) + parseFloat(1) );
            dailypropertyTax    = parseFloat(request.annualPropertyTax) / 360;
            estimatedTax        = parseFloat(estimatedPro) * parseFloat(dailypropertyTax);
            estimatedTax        = -Math.abs(estimatedTax);
        }
        if(request.proration == '0'){
            estimatedTax        = Math.abs(request.proration);
        }

        //creating result object
        result = {
            estimatedTax        : parseFloat(estimatedTax).toFixed( 2 )
        }; 
        return result;

	}*/	

	/*export function getBuyerEstimatedTax( request ){
 
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
export function getBuyerEstimatedTax(request) {
	current_date = request.closing_date;
	var perDayTax;
	//current_date = current_date.replace(/-/g, "/");
	d1 = new Date(current_date);
	month = d1.getMonth();
	year = d1.getFullYear();
	month = month + 1;

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
	} else if (request.state_id == 5) {  // CA State	
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
	
		firstQuarter_perDayTax = parseFloat(firstQuarterTax / 360).toFixed(2);
		secondQuarter_perDayTax = parseFloat(secondQuarterTax / 360).toFixed(2);

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
			var noOfDays = new Date(year, month + 1, 0).getDate();
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

export function useAnnualTaxforPrepaid(request) {
	var prepaidMonthTaxes = '0.00';
	var prepaidMonthRate = request.monthlyTax;

	if (request.countyId == 2090) {
		var annualProperty_Tax = (request.summerPropertyTax > 0) ? request.summerPropertyTax : request.winterPropertyTax;
	} else if (request.stateId == "10") {
		var annualProperty_Tax = parseFloat(request.summerPropertyTax) + parseFloat(request.winterPropertyTax);
	} else {
		var annualProperty_Tax = request.annualPropertyTax;
	}
	if (parseFloat(annualProperty_Tax) > 0 && request.months > 0) {
		if (request.stateId == "32" && request.countyId == "1821") {
			var _New_Mexico_Santa_Fe_Zip_Code = ['87501', '87502', '87503', '87504', '87505', '87506', '87507', '87508', '87509'];
			let zipCheck = _New_Mexico_Santa_Fe_Zip_Code.indexOf(request.zip);
			let rate = 1.0000;
			let oneYearTaxes = 1.0000;
			if (request.AnnualPropertyCheck == true) {
				if (zipCheck != -1) {
					rate = 0.024119;
					oneYearTaxes = (parseFloat(request.salePrice) / 3) * rate;
				} else {
					rate = 0.021747;
					oneYearTaxes = (parseFloat(request.salePrice) / 3) * rate;
				}
			}
			prepaidMonthTaxes = oneYearTaxes / 12 * request.months;
			prepaidMonthRate = rate;
		} else {
			prepaidMonthTaxes = (parseFloat(annualProperty_Tax) / 12) * request.months;
		}
	} else {
		if (request.months > 0 && request.monthlyTax > 0) {
			prepaidMonthTaxes = (((request.salePrice * request.monthlyTax) / 12) * request.months) / 100;
		}
	}

	result = {
		prepaidMonthTaxes: parseFloat(prepaidMonthTaxes).toFixed(2),
		prepaidMonthRate: parseFloat(prepaidMonthRate).toFixed(2)
	};
	return result;

}


/*
* IL CostsFirst Tax Proration
*/
function getIllinoisEstimatedTaxProration(countyIdHiddenValue, settlement_date) {
	//settlement_date = closingDate.replace(/-/g, "/");
	var closing_date = new Date(settlement_date);
	var current_year = closing_date.getFullYear();
	var date_from = '';
	//console.log("countyIdHiddenValue = " + countyIdHiddenValue);
	//console.log("current_year = " + current_year);
	//console.log("closingDate = " + settlement_date);
	// For Cook:
	var illinoisCountyCheck110 = inArray(countyIdHiddenValue, _illinois_counties_Arr_110);

	//console.log("illinoisCountyCheck110 " + illinoisCountyCheck110);

	//if (illinoisCountyCheck110 != -1) { // for web
	if (illinoisCountyCheck110 != false) {	// for mobile	
		// If the closing date is 1/1/Current through 3/4/Current, then days = number of days from 12/31/(Current - 2) to the closing date. 

		var start_date = new Date(current_year + '/' + 1 + '/' + 1); // YY,MM,DD
		

		//console.log("strts dt " + start_date);

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

	/*
		Calculating 2nd TD 
		Formula => 	
	*/
	export function get2ndTd(request){
		
		var year		= request.termsInYear;
		var amount		= request.amount;
		var rate		= request.interestRate;
			
		sum1 = rate / 1200;
		sum2 = sum1 + 1;
    	sum3 = year * 12;
    	sum4 = Math.pow(sum2, sum3);
    
		pnintrate = '0.00';
		if (amount != '0.00' && sum1 != '0.00' && sum3 != '0')
		{
			pnintrate = (amount * (sum1 * sum4)) / (sum4 - 1);
			pnintrate = pnintrate.toFixed(2);
			//pnintrate = numberFormat(pnintrate);
		}
		//creating result object
		result = {
			pnintrate		: pnintrate
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
