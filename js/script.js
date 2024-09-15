const locationInput = document.querySelector('.location-input')
const title = document.querySelector('.title')
const navbar = document.querySelector('.navbar')
const nowLocation = document.querySelector('.icon')
const textInspan = document.querySelector('.text')
const mainBox = document.querySelector('.main-box')
const forecastBox = document.querySelector('.forecast-box')
const todayTemp = document.querySelector('.today-temp')
const mainContent = document.querySelector('#content')
const iconWeather = document.querySelector('.icon-from-api')
const forecastIcon = document.querySelectorAll('.ficon img')
const hourTemp = document.querySelectorAll('.hour-icon img')
const searchBox = document.querySelector('.search-box')
const backgroundImg = document.querySelectorAll('.img-background')
const moon = document.querySelector(".moon")


const handleEvent = () => {

    title.classList.add('title-move-to-nav')
    title.classList.add('title-appear')
    locationInput.classList.add('location-input-move-to-nav')
    locationInput.classList.add('location-input-appear')
    nowLocation.classList.add('icon-move-to-nav')
    nowLocation.classList.add('icon-appear')
    textInspan.style.display = 'none'

    mainBox.classList.add('show-content', 'display-block')
    forecastBox.classList.add('show-content', 'display-block')
    todayTemp.classList.add('show-content', 'display-block')
    mainContent.classList.add('content-appear')


};

const api_key = '259cccf84057b7990205f689929a693e'

const nowTempAPI = (lat, lon) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
const forecastTempAPI = (lat, lon) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`
const cityNameAPI = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`
const cityforecastAPI = (city) => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`

const getCurrentAPI = (lat, lon, api, callback, city) => {

    let apiAddress = ''

    if (lat == undefined) {

        apiAddress = api(city)

    }

    else {

        apiAddress = api(lat, lon)

    }

    fetch(apiAddress)
        .then(response => {

            if (response.status === 200) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error('City not found (404)');
            } else {
                throw new Error(`Unexpected status code: ${response.status}`);
            }

        })
        .then(data => {

            handleEvent()
            const temp = (data.main.temp - 273.15).toFixed(0)
            const visibility = data.visibility / 1000
            const humidity = data.main.humidity
            const sunrise_time = new Date(data.sys.sunrise * 1000);
            const sunset_time = new Date(data.sys.sunset * 1000);
            const sunrise = convertTime(sunrise_time)
            const sunset = convertTime(sunset_time)
            const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            const description = data.weather[0].description
            if(lat == undefined){

                changeNameCity(data)

            }
            else {

                donChange()

            }
            

            return { temp, visibility, humidity, sunrise, sunset, icon, description }

        }).then(data => callback(data))
        .catch(error => console.error('Error: ', error))

}

const getForecastAPI = (lat, lon, api, city) => {

    let apiAddress = ''

    if (lat == undefined) {

        apiAddress = api(city)

    }

    else {

        apiAddress = api(lat, lon)

    }

    const forecast = (data) => {
        const dayForecast = document.querySelectorAll('.day-forecast');

        const daysOfWeek = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];

        const month = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]

        function getMonth(dateString) {

            const date = new Date(dateString)

            return month[date.getMonth()]

        }

        function getDay(dateString) {

            const date = new Date(dateString)

            return daysOfWeek[date.getDay()]

        }

        let index = 1

        while (index < 10) {

            const [date, time] = (data[index].dt_txt).split(' ')
            const [hour, min, sec] = time.split(':')

            if (hour == '00') {

                for (let i = 0; i < dayForecast.length; i++) {

                    const iconDom = dayForecast[i].querySelector('.ficon img')
                    const tempDom = dayForecast[i].querySelector('.ftem')
                    const dayDom = dayForecast[i].querySelector('.fday')
                    const monthDom = dayForecast[i].querySelector('.fmonth')
                    const weekDayDom = dayForecast[i].querySelector('.week-day')

                    const temp = (data[index].main.temp - 273.15).toFixed(0) + '°'
                    const dateTime = data[index].dt_txt
                    const [date, time] = dateTime.split(' ')
                    const [year, month, day] = date.split('-')


                    iconDom.setAttribute('src', `https://openweathermap.org/img/wn/${data[index].weather[0].icon}@2x.png`)
                    tempDom.innerHTML = temp
                    dayDom.innerHTML = day
                    monthDom.innerHTML = getMonth(dateTime)
                    weekDayDom.innerHTML = getDay(dateTime)

                    index += 8

                }

            }
            else {

                index += 1

            }

        }
        if(lat == undefined){

            changeNameCity(data[index])

        }
        else {

            donChange()

        }


    }
    fetch(apiAddress)
        .then(response => response.json())
        .then(data => data.list)
        .then(data => {
            const todayTemp = document.querySelectorAll('.hour');

            todayTemp.forEach((hourElem, i) => {
                if (data[i]) {
                    const hourIconDom = hourElem.querySelector('.hour-icon img');
                    const hourTempDom = hourElem.querySelector('.hour-temp');
                    const timeDom = hourElem.querySelector('.time');

                    const datetime = data[i].dt_txt;
                    const [date, time] = datetime.split(' ');
                    let [hour, min, sec] = time.split(':');

                    hour = Number(hour);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    hour = hour % 12;
                    hour = hour === 0 ? 12 : hour; // 0 should be shown as 12

                    const formattedTime = `${hour} ${ampm}`;

                    timeDom.innerHTML = formattedTime;
                    hourIconDom.setAttribute('src', `https://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png`);
                    hourTempDom.innerHTML = (data[i].main.temp - 273.15).toFixed(0) + '°'
                }
            });
            forecast(data);
        })
        .catch(error => console.log('Error fetching weather data', error));
};


convertTime = (milliseconds) => {


    let hours = milliseconds.getHours() % 12
    const ampm = milliseconds.getHours() >= 12 ? 'PM' : 'AM'
    hours = hours ? hours : 12
    let minutes = milliseconds.getMinutes()
    minutes = minutes < 10 ? '0' + minutes : minutes

    return { hours, minutes, ampm }

}

currentLocation = () => {

    navigator.geolocation.getCurrentPosition(location => {

        let latitude = location.coords.latitude
        let longitude = location.coords.longitude

        getCurrentAPI(latitude, longitude, nowTempAPI, changeMainTemp)
        getForecastAPI(latitude, longitude, forecastTempAPI)

    })

}

searchBox.addEventListener("keyup", (event) => {
    if (event.key === 'Enter') {
        if (searchBox.value === "") {}

        else {
            closeAllLists()
            getCurrentAPI(undefined, undefined, cityNameAPI, changeMainTemp, searchBox.value)
            getForecastAPI(undefined, undefined, cityforecastAPI, searchBox.value)

        }
    }
});

nowLocation.addEventListener("click", (event) => {

    closeAllLists()
    currentLocation()
    handleEvent()

});

const changeMainTemp = (data) => {

    const temperatureDom = document.querySelector('.temperature div:nth-child(2)')
    const visibilityDom = document.querySelector('.visibility div:last-child')
    const humidityDom = document.querySelector('.humidity div:last-child')
    const sunriseDom = document.querySelector('.sunrise div:last-child')
    const sunsetDom = document.querySelector('.sunset div:last-child')
    const mainIconDom = document.querySelector('.main-icon')
    const descriptionDom = document.querySelector('.temperature div:last-child')

    function showTime(data) {

        return data.hours + '.' + data.minutes + ' ' + data.ampm

    }

    temperatureDom.innerHTML = data.temp + '°'
    visibilityDom.innerHTML = data.visibility.toFixed(2) + '   km'
    humidityDom.innerHTML = data.humidity + '%'
    sunriseDom.innerHTML = showTime(data.sunrise)
    sunsetDom.innerHTML = showTime(data.sunset)
    mainIconDom.setAttribute('src', data.icon)
    descriptionDom.innerHTML = data.description
    console.log(data.temp)
    
    if(data.temp <= 15) {

        for(i = 0; i <= backgroundImg.length; i++) {

            backgroundImg[i].classList.remove('bg1')
            backgroundImg[i].classList.remove('bg2')
            backgroundImg[i].classList.remove('background-moon')
            backgroundImg[i].classList.remove('hot-background')
            backgroundImg[i].classList.remove('clear-background')
            moon.remove()
            console.log("none cold")
            backgroundImg[0].classList.add('cold-background')

        }

        console.log('cold')

    }
    else if(data.temp <= 25) {

        for(i = 0; i <= backgroundImg.length; i++) {

            backgroundImg[i].classList.remove('bg1')
            backgroundImg[i].classList.remove('bg2')
            backgroundImg[i].classList.remove('background-moon')
            backgroundImg[i].classList.remove('hot-background')
            backgroundImg[i].classList.remove('cold-background')
            moon.remove()
            console.log("none clear")
            backgroundImg[0].classList.add('clear-background')

        }

        console.log('clear')

    }
    else if(data.temp > 25) {

        for(i = 0; i <= backgroundImg.length; i++) {

            backgroundImg[i].classList.remove('bg1')
            backgroundImg[i].classList.remove('bg2')
            backgroundImg[i].classList.remove('background-moon')
            backgroundImg[i].classList.remove('clear-background')
            backgroundImg[i].classList.remove('cold-background')
            moon.remove()
            console.log("none hot")
            backgroundImg[0].classList.add('hot-background')

        }

        console.log('hot')

    }
    else {

        console.log('ERROR')

    }

}

const changeNameCity = (response) => {

    const title = document.querySelector('.title')

    title.innerHTML = response.name

}

const donChange = () => {

    const title = document.querySelector('.title')

    title.innerHTML = 'Current Location'
}

const search = document.querySelector('.search-box')
const resultsBox = document.querySelector('.result-box')

search.addEventListener("input", function() {
    const val = this.value;
    if (!val) {
        closeAllLists();
        return false;
    }

    fetch(`https://api.openweathermap.org/data/2.5/find?q=${val}&type=like&sort=population&cnt=5&appid=${api_key}`)
        .then(response => response.json())
        .then(data => {
            closeAllLists();
            if (data && data.list && data.list.length > 0) {
                const listContainer = document.createElement("ul");
                listContainer.setAttribute("class", "result-box");
                this.parentNode.appendChild(listContainer);

                data.list.forEach(city => {
                    const item = document.createElement("li");
                    item.innerHTML = `${city.name}, ${city.sys.country}`;
                    item.innerHTML += `<input type='hidden' value='${city.name}, ${city.sys.country}'>`;

                    item.addEventListener("click", function() {
                        cityName = this.getElementsByTagName("input")[0].value;
                        getCurrentAPI(undefined, undefined, cityNameAPI, changeMainTemp, cityName)
                        getForecastAPI(undefined, undefined, cityforecastAPI, cityName)
                        closeAllLists();
                    });

                    listContainer.appendChild(item);
                });
            }
        });
});

function closeAllLists(elmnt) {
    const items = document.getElementsByClassName("result-box");
    while (items.length > 0) {
        items[0].parentNode.removeChild(items[0]);
    }
}

document.addEventListener("click", function(e) {
    closeAllLists(e.target);
});