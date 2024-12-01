// Automatically get user location and fetch weather when the page loads
document.addEventListener('DOMContentLoaded', getUserLocation);

// Materialize - Initializers
$(document).ready(function () {
    $(".scrollspy").scrollSpy()
    // Initialize collapse button
    $(".button-collapse").sideNav({
        menuWidth: 190, // Default is 240
        edge: "left", // Choose the horizontal origin
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    })

    // Scroll to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('#scrollToTopBtn').fadeIn();
        } else {
            $('#scrollToTopBtn').fadeOut();
        }
    });

    $('#scrollToTopBtn').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 300);
        return false;
    });

    // Contact form submission
    $(document).on('click', '#submit', function (event) {
        // Validate name
        var name = $('#from_name').val().trim();
        if (name === '') {
            alert('Please enter your name.');
            return;
        }

        // Validate email
        var email = $('#reply_to').val().trim();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '' || !emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Validate message
        var message = $('#message').val().trim();
        if (message === '') {
            alert('Please enter a message.');
            return;
        }

        // If all validations pass, proceed with sending the email
        sendMail(event);
    });

});

function sendMail(event) {
    event.preventDefault();

    var btn = $('#submit');
    btn.css('background-color', '#a7d1cd')
    btn.text('Sending...');

    const serviceID = 'bornoahmed2-mail-service';
    const templateID = 'template-contact-form';

    var templateParams = {
        from_name: $('#from_name').val(),
        reply_to: $('#reply_to').val(),
        message: $('#message').val()
    };
    $('#from_name').val('');
    $('#reply_to').val('');
    $('#message').val('');
    //Add a timeout of 3 seconds before sending the email
    // setTimeout(() => {
    //     btn.text('Send Message');
    //     btn.text('Message Sent!');
    //     btn.css('background-color','#2bbbad')
    //         setTimeout(() => {
    //             btn.text('Send Message');
    //         }, 1500);
    // }, 3000);
    // return;
    emailjs.send(serviceID, templateID, templateParams)
        .then(function () {
            btn.text('Message Sent!');
            btn.css('background-color', '#2bbbad')
            setTimeout(() => {
                btn.text('Send Message');
            }, 1500);
        }, function (err) {
            btn.text('Send Message');
            btn.css('background-color', '#2bbbad')
            console.log(JSON.stringify(err));
            alert("There was a problem sending this message. Please try other method of communications")
        });
}

function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeather(latitude, longitude);
        }, function (error) {
            console.error("Error getting user location:", error);
            document.getElementById('weather').innerHTML = '<p>Unable to get location</p>';
        });
    } else {
        console.log("Geolocation is not available");
        document.getElementById('weather').innerHTML = '<p>Geolocation is not supported</p>';
    }
}

function getWeather(latitude, longitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code,is_day`;
    const geocodeUrl = `https://api-bdc.net/data/reverse-geocode?latitude=24.375&longitude=88.625&key=bdc_61b156531dc94dabba1eaf5f2c49cad3`;

    Promise.all([
        fetch(weatherUrl).then(response => response.json()),
        fetch(geocodeUrl).then(response => response.json())
    ])
    .then(([weatherData, locationData]) => {
        const current = weatherData.current;
        const locationName = (locationData.city  + ', ' + locationData.countryName ) || 'Unknown';
        setWeather(current, locationName);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('weather').innerHTML = '<p>Unable to fetch weather data</p>';
        document.getElementById('weather_icon').innerHTML = '';
    });
}

function getWeatherIcon(weatherCode) {
    // Map weather codes to icon URLs and descriptions
    const iconMap = {
        0: { icon: 'https://openweathermap.org/img/wn/01d@2x.png', description: 'Clear sky' },
        1: { icon: 'https://openweathermap.org/img/wn/02d@2x.png', description: 'Mainly clear' },
        2: { icon: 'https://openweathermap.org/img/wn/03d@2x.png', description: 'Partly cloudy' },
        3: { icon: 'https://openweathermap.org/img/wn/04d@2x.png', description: 'Overcast' },
        45: { icon: 'https://openweathermap.org/img/wn/50d@2x.png', description: 'Foggy' },
        48: { icon: 'https://openweathermap.org/img/wn/50d@2x.png', description: 'Depositing rime fog' },
        51: { icon: 'https://openweathermap.org/img/wn/09d@2x.png', description: 'Light drizzle' },
        53: { icon: 'https://openweathermap.org/img/wn/09d@2x.png', description: 'Moderate drizzle' },
        55: { icon: 'https://openweathermap.org/img/wn/09d@2x.png', description: 'Dense drizzle' },
        61: { icon: 'https://openweathermap.org/img/wn/10d@2x.png', description: 'Slight rain' },
        63: { icon: 'https://openweathermap.org/img/wn/10d@2x.png', description: 'Moderate rain' },
        65: { icon: 'https://openweathermap.org/img/wn/10d@2x.png', description: 'Heavy rain' },
        71: { icon: 'https://openweathermap.org/img/wn/13d@2x.png', description: 'Slight snow fall' },
        73: { icon: 'https://openweathermap.org/img/wn/13d@2x.png', description: 'Moderate snow fall' },
        75: { icon: 'https://openweathermap.org/img/wn/13d@2x.png', description: 'Heavy snow fall' },
        95: { icon: 'https://openweathermap.org/img/wn/11d@2x.png', description: 'Thunderstorm' },
    };

    return iconMap[weatherCode] || { icon: 'https://openweathermap.org/img/wn/01d@2x.png', description: 'Unknown' };
}

function setWeather(current, locationName) {
    const { icon: weatherIcon, description: weatherDescription } = getWeatherIcon(current.weather_code);
    
    const isDay = current.is_day === 1;
    const backgroundColor = isDay ? 'rgb(39 193 178 / 50%)' : 'rgb(11 61 56 / 18%)';
    const textColor = isDay ? 'rgb(44 41 47 / 81%)' : '#FFFFFF';
    
    const $weatherDiv = $('#weather');
    $weatherDiv.css({
        backgroundColor:backgroundColor,
        color: textColor,
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: 'auto',
        minHeight: '265px',
        maxHeight: '90%',
        marginTop: '35px',
        fontFamily: 'cursive',
        fontSize: 'larger',
        //backgroundColor: 'transparent',
        // backgroundImage: `url('assets/img/weather/weather-bg-${isDay ? 'day' : 'night'}.jpg')`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat'
    });

    const currentTime = new Date();
    const hours = currentTime.getHours();
    let greeting;
    if (hours >= 5 && hours < 11) {
        greeting = "Good Morning";
    } else if(hours >= 12 && hours < 15){
        greeting = "Good Noon";
    } else if (hours >= 15 && hours < 17) {
        greeting = "Good Afternoon";
    } else if (hours >= 17 && hours < 20) {
        greeting = "Good Evening";
    } else {
        greeting = "Good Night";
    }

    $weatherDiv.html(`
        <h5 style="margin: 0 0 10px 0;">${greeting}</h5>
        
        <p style="margin: 0 0 15px 0;"> ${locationName}</p>
        <hr style="width: 80%; border: 0; border-top: 1px solid rgba(255,255,255,0.3); margin: 10px 0;">
        <img src="${weatherIcon}" alt="Weather Icon" width="150" height="150" style="margin-bottom: 5px;">
        <p style="margin: 0 0 15px 0;">${weatherDescription}</p>
        <hr style="width: 80%; border: 0; border-top: 1px solid rgba(255,255,255,0.3); margin: 10px 0;">
        <p style="margin: 5px 0;">Temperature: ${current.temperature_2m}°C</p>
        <p style="margin: 5px 0;">Wind Speed: ${current.wind_speed_10m} km/h</p>
    `);
}




