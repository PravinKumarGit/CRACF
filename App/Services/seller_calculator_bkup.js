
	var result;
	/*
		Calculating amount, adjusted and down payment for FHA loan type
		Formula => 	Amount		= SP * LTV / 100
	*/
	export function getSellerAmountFHA( request ){
		var amount;
		amount 			= request.salePrice * request.LTV/100;								//Formula applied here to calculate the amount						//calculating down payment
		
		//creating result object
		result = {
			amount		:amount,
		}; 
		return result;
	}

	/*
		Calculating Cost Type Total 
		Formula => 	totalCostRate	= parseFloat(request.rate);							//for flat rate
					totalCostRate	= request.rate * request.salePrice / 100;			//for sale price
					totalCostRate	= request.rate * request.amount / 100;				//for loan
	*/
	export function getSellerCostTypeTotal(request){
		
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
	export function getSellerTotalCostRate(request){
		
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
	export function getSellerListSellAgt(request){
		
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
		Formula => 	resultData	= request.SCC_Brokage_Fee / 2;					
	*/
	export function getSellerListSellAgtValues(request){
		
		var list_agt;
		var sell_agt;
		var totalAgt;
			
		list_agt	= request.listAgt * request.salePrice / 100;
		sell_agt	= request.sellAgt * request.salePrice / 100;
		totalAgt	= list_agt + sell_agt;
		//creating result object
		result = {
			list_agt		: list_agt.toFixed( 2 ),
			sell_agt		: sell_agt.toFixed( 2 ),
			totalAgt		: totalAgt.toFixed( 2 )
		}; 
		return result;
	}


	
	/*
		Calculating existing balance and rate
		Formula => 	daysInterest	= existing_total / 365 * days;
	*/
	export function getSellerExistingBalanceCalculation(request){
		
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
		Calculating discount amount
		Formula => 	discount 	= amount * discountPerc / 100
	*/
	export function getSellerDiscountAmount( request ){
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

	//getSellerEstimatedTax
	/*
		Calculating discount amount
		Formula => 	discount 	= amount * discountPerc / 100
	*/
	export function getSellerEstimatedTax( request ){
	
		if(request.date >= '29'){
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

	//getSellerSumSSC

	/*
		Calculating Total closing cost setting data
		Formula => 	totalPrepaidItems 	= add all request data
	*/
	export function getSellerSumSSC(request){
		
		var totalSSCData;
		totalSSCData 		= parseFloat(request.SCC_Drawing_Deed) + parseFloat(request.SCC_Notary) + parseFloat(request.SCC_TransferTax) +	parseFloat(request.SCC_Reconveynce_Fee) + parseFloat(request.SCC_Pest_Control_Report) + parseFloat(request.SCC_Demand_Statement) + parseFloat(request.SCC_Prepayment_Penalty);				//Formula applied here to calculate the Total closing cost data
		
		//creating result object
		result = {
			totalSSCData		: totalSSCData
		}; 
		return result;
	}

	/*
		Calculating agrigate list and sell values 
		Formula => 	resultData	= request.SCC_Brokage_Fee / 2;					
	*/
	export function getSellerListSellAgtPer(request){
		
		var listAgt;
		var sellAgt;
		var totalAgt;
			
		listAgt		=  (request.list_agt / request.salePrice) * 100;
		sellAgt		=  (request.sell_agt / request.salePrice) * 100 ;
		totalAgt	= parseFloat(request.list_agt) + parseFloat(request.sell_agt);
		//creating result object
		result = {
			listAgt		: listAgt.toFixed( 2 ),
			sellAgt		: sellAgt.toFixed( 2 ),
			totalAgt	: totalAgt.toFixed( 2 )
		}; 
		return result;
	}
	
