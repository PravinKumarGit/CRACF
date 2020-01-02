
	var result;
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
			amount		:amount,
			adjusted	:adjusted,
			downPayment	:downPayment
		}; 
		return result;
	}

	/*
		Calculating amount and down payment for Conventional loan type
		Formula => 	Amount 		= SP * LTV / 100
					DownPayment = SP - Amount
	*/
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
		
		//creating result object
		result = {
			amount		:amount,
			amount2		:amount2,
			downPayment	:downPayment
		}; 
		return result;
	}

	/*
		Calculating adjusted amount for VA loan type
		Formula => 	Adjusted 	= amount + (amount * FF / 100)					
	*/
	export function getAdjustedVA( request ){
		var adjusted;
		
		adjusted 	= parseInt(request.salePrice) + ( parseInt(request.salePrice) * request.FF/100 );		//Formula applied here to calculate the adjusted

		//creating result object
		result = {
			amount		:request.salePrice,
			adjusted	:adjusted,
			downPayment	:0
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
			amount		:request.salePrice,
			adjusted	:adjusted,
			downPayment	:0
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
			discount		:discount
		}; 
		return result;

	}
	/*
		Calculating discount amount
		Formula => 	discount 	= amount * discountPerc / 100
	*/
	export function getDiscountPer( request ){
		var discountPer;
		if((request.discountValue === undefined || request.discountValue === '') || (request.amount === undefined || request.amount === '')){
			return result = { discountPer : 0 };
		}
		discountPer 	= parseInt(request.discountValue) / parseInt(request.amount)*100 ;		//Formula applied here to calculate the discount percentage
		//creating result object
		result = {
			discountPer		:discountPer
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
			request.amount = request.amount + request.amount2
		}

		originationFee 	= parseInt(request.amount) * parseInt(request.originationFee)/100 ;		//Formula applied here to calculate the origination Fee
		
		//creating result object
		result = {
			originationFee		: parseFloat(originationFee).toFixed( 2 )
		}; 
		return result;

	}
	/*
		Calculating Prepaid Monthly Tax
		Formula => 	prepaidMonthTaxes	= (Sales Price * Monthly tax rate/12) * Months / 100 
		
	*/
	export function getPreMonthTax( request ){
		var prepaidMonthTaxes;
		prepaidMonthTaxes 	= (parseInt(request.salePrice) * request.monthlyTax/12) * parseInt(request.months)/100 ;		//Formula applied here to calculate the prepaid month tax
		
		//creating result object
		result = {
			prepaidMonthTaxes		: parseFloat(prepaidMonthTaxes).toFixed( 2 )
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
			monthInsurance		: parseFloat(monthInsurance).toFixed( 2 )
		}; 
		return result;

	}

	/*
		Calculating Homw Owner insurance
		Formula => 	monthlyInsurance	= monthInsuranceRes / months 
		
	*/
	export function getHomeOwnerInsurance( request ){
		var homeOwnerInsuranceRes;
		
		homeOwnerInsuranceRes 	= (parseFloat(request.monthInsuranceRes) / parseFloat(request.months)) ;		//Formula applied here to calculate the monthly Homw Owner insurance
		
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
		
		//creating result object
		result = {
			adjustmentTaxIntRes		: parseFloat(adjustmentTaxIntRes).toFixed( 2 )
		}; 
		return result;

	}
	
	/*
		Calculating days interest
		Formula => 	monthlyInsurance	=  (Adjusted * Interest rate / 360) * days / 100
		
	*/
	export function getDailyInterest( request ){
		var daysInterest;
		
		daysInterest 	= (parseFloat(request.adjusted) * parseFloat(request.interestRate) / 360) * parseFloat(request.days)/100 ;		//Formula applied here to calculate the days interest
		
		//creating result object
		result = {
			daysInterest		:parseFloat(daysInterest)
		}; 
		
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
	export function getVaFundingFinance( request ){
		var VaFfFin, VaFfFin1, VaFfFin2;
		
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

	}
	/*
		Calculating USDA MIP Finance for prepaid section
		Formula => 	UsdaMipFinance 	= amount * MIP
	*/
	export function getUsdaMipFinance( request ){
		var UsdaMipFinance, UsdaMipFinance1, UsdaMipFinance2;
		
		UsdaMipFinance 		= parseInt(request.salePrice) * request.MIP ;				//Formula applied here to calculate the UsdaMipFinance
		UsdaMipFinance		= parseFloat(UsdaMipFinance).toFixed( 2 );
		var res 			= UsdaMipFinance.split(".");
		UsdaMipFinance1			= res[0] + ".00";
		//UsdaMipFinance2			= "0." + res[1];
		UsdaMipFinance2			= "0.00";

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
		
		monthlyRateMMI 		= (parseFloat(request.amount) * request.rateValue) / (12 * 100) ;				//Formula applied here to calculate the UsdaMipFinance
	
		//creating result object
		result = {
			monthlyRateMMI		:monthlyRateMMI.toFixed(2)
		}; 
		return result;
	}


	/*
		Calculating Total Prepaid Items
		Formula => 	totalPrepaidItems 	= add all request data
	*/
	export function getTotalPrepaidItems(request){
		
		var totalPrepaidItems;
		totalPrepaidItems 		= parseFloat(request.prepaidMonthTaxesRes) + parseFloat(request.monthInsuranceRes) + parseFloat(request.daysInterestRes) + parseFloat(request.financialVal) + parseFloat(request.prepaidAmount);				//Formula applied here to calculate the Total Prepaid Items
		
		//creating result object
		result = {
			totalPrepaidItems		:totalPrepaidItems
		}; 
		return result;
	}

	/*
		Calculating Total Monthly Payment
		Formula => 	totalMonthlyPayment 	= add all request data
	*/
	export function getTotalMonthlyPayment(request){
		
		var totalMonthlyPayment;
		totalMonthlyPayment 		= parseFloat(request.principalRate) + parseFloat(request.realEstateTaxesRes) + parseFloat(request.homeOwnerInsuranceRes) + parseFloat(request.monthlyRate) + parseFloat(request.pnintrate) + parseFloat(request.paymentAmount1) + parseFloat(request.paymentAmount2);				//Formula applied here to calculate the Total Prepaid Items
		
		//creating result object
		result = {
			totalMonthlyPayment		:totalMonthlyPayment.toFixed( 2 )
		}; 
		return result;
	}
	
	/*
		Calculating Total Investment
		Formula => 	totalInvestment 	= add all request data
	*/
	export function getTotalInvestment(request){
		
		var totalInvestment;
		
		totalInvestment 		= parseFloat(request.downPayment) + parseFloat(request.totalClosingCost) + parseFloat(request.estimatedTaxProrations) + parseFloat(request.totalPrepaidItems) ;				//Formula applied here to calculate the Total Prepaid Items
		
		//creating result object
		result = {
			totalInvestment		:totalInvestment.toFixed( 2 )
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
		Formula => 	totalCostRate	= cost1 + cost2 + .... + costN;						
	*/
	export function getTotalCostRate(request){
		
		var totalCostRate;
			
		totalCostRate	= parseFloat(request.cost1) + parseFloat(request.cost2) + parseFloat(request.cost3) + parseFloat(request.cost4) + parseFloat(request.cost5) + parseFloat(request.cost6) + parseFloat(request.cost7) + parseFloat(request.cost8) + parseFloat(request.cost9) + parseFloat(request.cost10);
		//creating result object
		result = {
			totalCostRate		: totalCostRate
		}; 
		return result;
	}

	/*
		Calculating Estimated Tax
		Formula => 	estimatedPro 		= request.proration - 30 + ( request.date - 1 );
					dailypropertyTax	= request.annualPropertyTax / 360;
					estimatedTax		= estimatedPro * dailypropertyTax;
	*/
	export function getBuyerEstimatedTax( request ){
	
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

	export function numberFormat(nStr) {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1))
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		sum = x1 + x2;
		return sum;
	}
	/**
	 * This export function formats numbers by remove commas
	 */
	export function removeCommas(aNum) {
		if( typeof aNum == 'undefined' ) {
			console.log("caller 1 is " + arguments.callee.caller.toString());  
		}
		aNum = aNum.replace(/,/g, "");
		if( typeof aNum == 'undefined' ) {
			console.log("caller 2 is " + arguments.callee.caller.toString());  
		}

		aNum = aNum.replace(/\s/g, "");
		if( typeof aNum == 'undefined' ) {
			console.log("caller 3 is " + arguments.callee.caller.toString());  
		}

		return aNum;
	}
	

