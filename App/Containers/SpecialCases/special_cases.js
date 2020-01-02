 //creating object for discount percentage and amount  
  let request = { 'summerPropertyTax': this.summerPropertyTax, 'winterPropertyTax': this.winterPropertyTax, 'annualPropertyTax': this.annualPropertyTax, 'prorationPercent': this.prorationPercent, 'proration': this.BuyerProrationData, 'closing_date': this.EstStlmtDate, 'state_code': this.state, 'state_id': this.stateId, 'county_id': this.county, 'city': this.city };
  
  
  
  =====================
prorationLength = Object.keys(this.BuyerProrationData.data).length;
  if (prorationLength == 2 && this.stateId != 2) {
   if (this.stateId == 23) { // Michigan
    this.prorationFirst = "Summer Property Tax $";
    this.prorationSecond = "Winter Property Tax $";
   } else if (this.stateId == 10) { // Florda
    this.prorationFirst = "Advalorem Property Tax $";
    this.prorationSecond = "Non Advalorem Property Tax $";
   } else if (this.stateId == 36) { //OHIO 
    this.prorationFirst = "Due & Payable Method $";
    this.prorationSecond = "Lien Method $";
   } else if (this.stateId == 39) { // PENNSYLVANIA
    this.prorationFirst = "Summer Tax Calculation $";
    this.prorationSecond = "Spring Tax Calculation $";
   }
   this.summerPropertyTax = parseFloat(this.summerPropertyTax).toFixed(2);
   this.winterPropertyTax = parseFloat(this.winterPropertyTax).toFixed(2);
  } else {
   this.prorationThird = "Annual Property Tax $";
   this.annualPropertyTax = parseFloat(this.annualPropertyTax).toFixed(2);
  }
========================================