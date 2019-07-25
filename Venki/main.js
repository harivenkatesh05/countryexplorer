//Init the country class
const country = new Countries

// define empty variables for currency
let currencyName = '';
let currencyCode = '';
let currencySymbol = '';
let countryNameData = '';

// grabs output fields
const outputCountryName = document.querySelector('.country__output-name');
const outputCountryRegion = document.querySelector('.country__output-region');
const outputCountryISO = document.querySelector('.country__output-iso');
const outputCountryCapital = document.querySelector('.country__output-capital');
const outputCountryPopulation = document.querySelector('.country__output-population');
const outputCountryCurrency = document.querySelector('.country__output-currency');
const outputCountryLanguages = document.querySelector('.country__output-languages');
const outputCountryFlag = document.querySelector('.country__output-flag');
const outputCountryMapImage = document.querySelector('.country-output__mapImage');

// grabs ui buttons and output fields
const countryButtons = document.getElementById('country__buttons');
const mainOutput = document.getElementById('country__output-main');
const currencyOutput = document.getElementById('country-output-secondary');

// grabs input from the input field on keystroke
document.getElementById('input__countryInput').addEventListener('keyup', countryInputName);

// input from suggestions list
document.getElementById('country__output-suggestions').addEventListener('click', (e) => {
  if(e.target.classList.contains('country-suggestion-button')){ 
    document.getElementById('input__countryInput').value = e.target.value; 
    countryInputName(e);  

    e.target.parentNode.innerHTML = '';
  }    
})

// finds the country to display from input
function countryInputName(e){
  countryNameData = e.target.value;

  mainOutput.style.display = 'block';
  document.querySelector('.country-output-secondary').style.display = 'none';

  //does not make fetch call if the field is blank
  if (countryNameData !== ''){
    clearFields();
    
    country.getCountry(countryNameData).then(data => {  
      // display suggestions of countries as the user types them in
      if (data.length === 1){
        // clears the suggestions if there is only one country suggested
        clearSuggestion();
      }
      // displays max three suggested countries
      else if(data.length <= 3) {
        clearSuggestion();

        for(let i = 0; i < data.length; i++){
          document.querySelector('.country__output-suggestions').innerHTML += `  
          <button class="country-suggestion-button" value="${data[i].name}">${data[i].name}</button>  `
        }
      } else if(data.length === 1) {
        clearSuggestion();
      }

      // clears the output if the country is not found and displays an alert
      if (data.message === 'Not Found') {
        clearFields();
        mainOutput.style.display = 'none';
        countryButtons.style.display = 'none';

        clearAlert();

        // display the warning message
        const countryNotFound = document.createElement('div');
        countryNotFound.className = 'alert';
        countryNotFound.appendChild(document.createTextNode('Country Does Not Exist'))
        document.querySelector('.country-output').appendChild(countryNotFound);

        // remove the warning message
        setTimeout(() => {
          clearAlert();
        }, 1000);

      // display the data
      } else {
        clearAlert();

        // get the needed country data
        const countryName = data[0].name;
        const countryAlphaCode = data[0].alpha3Code;
        const countryRegion = data[0].subregion;
        const countryFlag = data[0].flag;
        const countryCapital = data[0].capital;
        const countryLanguages = data[0].languages;
        const countryCurrency = data[0].currencies;
        let countryPopulation = data[0].population;

        // get the data for the map images
        const mapAlphaCode = data[0].alpha2Code;

        // convert the population number to have commas
        countryPopulation = numberWithCommas(countryPopulation);
        function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        // gets the country currency
        if(countryCurrency.length === 1) {
          currencyName = countryCurrency[0].name;
          currencyCode = countryCurrency[0].code;
          currencySymbol = countryCurrency[0].symbol;

          outputCountryCurrency.innerText = `${currencyName}, ${currencyCode}, (${currencySymbol})`;
        } else
        // get the curriences if there is more than one
        if(countryCurrency.length > 1) {
          for(i in countryCurrency) {
            currencyName = countryCurrency[i].name;
            currencyCode = countryCurrency[i].code;
            currencySymbol = countryCurrency[i].symbol;

            outputCountryCurrency.innerText += 
            `${currencyName}, ${currencyCode} (${currencySymbol})
            `;
          }
        }

        // get the languages of the country
        if(countryLanguages.length === 1) {
          let nativeLanguageName = countryLanguages[0].nativeName;
          let languageName = countryLanguages[0].name;

          outputCountryLanguages.innerText = `${nativeLanguageName}, ${languageName}`;
        } else 
        // gets languages if there is more than one
        if(countryLanguages.length > 1) {

          for(i in countryLanguages) {
            nativeLanguageName = countryLanguages[i].nativeName;
            languageName = countryLanguages[i].name;

            outputCountryLanguages.innerText += 
            `${nativeLanguageName}, ${languageName}
            `;
          }
        }

        // update ui with information
        outputCountryName.innerText = countryName;
        outputCountryRegion.innerText = countryRegion;
        outputCountryISO.innerText = countryAlphaCode;
        outputCountryCapital.innerText = countryCapital;
        outputCountryPopulation.innerText = countryPopulation;
        outputCountryFlag.innerHTML = `<img src="${countryFlag}" class="country__output-flag-image">`
        outputCountryMapImage.innerHTML = `<img src="https://img.geonames.org/img/country/250/${mapAlphaCode}.png" alt="map of the ${countryName}">`;
        countryButtons.style.display = 'block';
      }
    }) 
    
    //clear output fields if the input is blank
    } else if(countryNameData === ''){
      clearFields();
      clearSuggestion();
      mainOutput.style.display = 'none';
      countryButtons.style.display = 'none'
    }

    // clear the output fields
    function clearFields() {
      outputCountryName.innerText = '';
      outputCountryRegion.innerText = '';
      outputCountryISO.innerText = '';
      outputCountryCapital.innerText = '';
      outputCountryPopulation.innerText = '';
      outputCountryCurrency.innerText = '';
      outputCountryLanguages.innerText = '';
      outputCountryFlag.innerHTML = ' ';
      outputCountryMapImage.innerHTML = ' ';

      document.querySelector('.country__output-baseCurrency').innerText = '';
      document.querySelector('.country__output-forexCAD').innerText = '';
      document.querySelector('.country__output-forexUSD').innerText = '';
      document.querySelector('.country__output-forexGBP').innerText = '';
      document.querySelector('.country__output-forexJPY').innerText = '';
    }

    // clear alert
    function clearAlert() {
      const currentAlert = document.querySelector('.alert')

      if(currentAlert) {
        currentAlert.remove();
      }
    }

    // clear suggestions
    function clearSuggestion() {
      const currentSuggestions = document.querySelector('.country__output-suggestions');

      if (currentSuggestions) {
        currentSuggestions.innerHTML = '';
      }
    }
  
}

// changes the "tab" when clicked on currency or country
document.querySelector('.country-currency').addEventListener('click', function(e){
  document.getElementById('country__output-main').style.display = 'none';
  document.getElementById('country-output-currency').style.display = 'block';

  // makes sure the currency variable is defined
  if (currencyCode !== '' || currencyCode !== null || currencyCode !== undefined && currencyCode.length === 1){
    country.getExchange(currencyCode).then(data => {  

      // prints message if currency exchange is not available
      if (data.error) {
        document.querySelector('.country__output-baseCurrency').innerText = `unavailable for this country's currency`;

        document.querySelector('.country__output-baseCurrency').innerText = baseExchange;
        document.querySelector('.country__output-forexCAD').innerText = forexRates.CAD;
        document.querySelector('.country__output-forexUSD').innerText = forexRates.USD;
        document.querySelector('.country__output-forexGBP').innerText = forexRates.GBP;
        document.querySelector('.country__output-forexJPY').innerText = forexRates.JPY;

      } else {

        // get the exchange data
        const baseExchange = data.base;
        const forexRates = data.rates;

        // display the exchange data
        // doesn't seem to work with EUR rates 
        document.querySelector('.country__output-baseCurrency').innerText = baseExchange;
        document.querySelector('.country__output-forexCAD').innerText = forexRates.CAD;
        document.querySelector('.country__output-forexUSD').innerText = forexRates.USD;
        document.querySelector('.country__output-forexGBP').innerText = forexRates.GBP;
        document.querySelector('.country__output-forexJPY').innerText = forexRates.JPY;
      }
    })
  }
})

// changes the "tab" to country from currency
document.querySelector('.country-info').addEventListener('click', function(e){
  mainOutput.style.display = 'block';
  document.querySelector('.country-output-secondary').style.display = 'none';
})
