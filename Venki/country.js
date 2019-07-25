class Countries {
  
  async getCountry(country) {
    const countryResponse = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
    const countryData = await countryResponse.json();

    return countryData; 
  }

  async getExchange(countryCurrency) {
    const exchangeResponse = await fetch(`https://api.exchangeratesapi.io/latest?base=${countryCurrency}&symbols=CAD,USD,GBP,JPY`);
    const exchangeData = await exchangeResponse.json();
  
    return exchangeData
  }
}