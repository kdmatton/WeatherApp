
document.querySelector('#btnSearch').addEventListener('click', () => {
    const strCity = document.querySelector('#txtCityName').value

    // this gets the long, lat of given city and return info
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${strCity}&count=1`)
    .then(result => {
        if(result.ok){
            return result.json()
        } else {
            throw new Error(result.status)
        }
    })
    .then(data => {
        let strLat = data.results[0].latitude
        let strLong = data.results[0].longitude
        let strCityName = data.results[0].name
        let strState = data.results[0].admin1
        
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${strLat}&longitude=${strLong}&current=temperature_2m,relative_humidity_2m,weather_code`)
        .then(result => {
        if(result.ok){
            return result.json()
        } else {
            throw new Error(result.status)
        }
        })
        .then(data => {
            // set weather code icons & conditions
            let weatherCode = data.current.weather_code
            let currentWeatherIcon = ''
            let condition = ''
            if(weatherCode == 0) {
                currentWeatherIcon = '<i class="bi bi-sun-fill"></i>'
                condition = 'Clear Sky'
            }
            if(weatherCode >= 1 && weatherCode <= 3) {
                currentWeatherIcon = '<i class="bi bi-cloud-sun-fill"></i>'
                condition = 'Mostly Clear'
            }
            if(weatherCode >= 45 && weatherCode <= 48) {
                currentWeatherIcon = '<i class="bi bi-cloud-fog-fill"></i>'
                condition = 'Foggy'
            }
            if(weatherCode >= 51 && weatherCode <= 67) {
                currentWeatherIcon = '<i class="bi bi-cloud-drizzle-fill"></i>'
                condition = 'Rainy'
            }
            if(weatherCode >= 71 && weatherCode <= 77) {
                currentWeatherIcon = '<i class="bi bi-cloud-snow-fill"></i>'
                condition = 'Snowing'
            }
            if(weatherCode == 95) {
                currentWeatherIcon = '<i class="bi bi-cloud-lightning-rain-fill"></i>'
                condition = 'Thundering'
            }

            // Update the divWeather
            document.querySelector('#divWeather').innerHTML = `

                <div class="col-md-6 d-flex align-items-center justify-content-center">
                    <h1> <i class="bi bi-geo-alt text-danger"></i></h1>
                    <h3 style="color: Red;">${strCityName}, ${strState}</h2>
                </div>

                <div class="col-md-6 d-flex flex-column align-items-center justify-content-center gap-3">
                    <h4 class="col-12 text-center" style="color: grey">Current Conditions</h4>
                    <h4>${currentWeatherIcon} ${condition}</h4>
                    <hr style="width: 80%; border: 1px solid black;">
                    <div class="d-flex gap-5">
                        <h4> <i class="bi bi-thermometer-half"></i> ${data.current.temperature_2m}°C</h4>
                        <h4> <i class="bi bi-moisture"></i> ${data.current.relative_humidity_2m}% Humidity</h3>
                    </div>
                </div>
            `
        })
    
    })
    .catch(error => {
        console.error(error)
    })

})
