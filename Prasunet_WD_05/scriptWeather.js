const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".inputPart"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = document.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");


let api;


inputField.addEventListener("keyup", e=>{
    //if user press Enter by without input value
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){  //if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onEroor);
    }
    else{
        alert("Your browser does not support geolocation api");
    }
});

function onSuccess(position){
    const {latitude,longitude} = position.coords; //getting lat and lon of the user device from coords object
    api=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=df7af939fe660214a581299cf24ee7b9`;
    fetchData();
}

function onEroor(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city){
    api= `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=df7af939fe660214a581299cf24ee7b9`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));


}

function weatherDetails(info){
   if(info.cod == "404"){
    infoTxt.innerText = `${inputField.value} is not a valid city name`;
    infoTxt.classList.replace("pending", "error");
   }
   else{
    //let's get required properties value from the info object
    const city=info.name;
    const country=info.sys.country;
    const {description, id}=info.weather[0];
    const {feels_like, humidity, temp}=info.main;

    //using custom icon according to the id which api return us

    if(id == 800){
        wIcon.src = "weatherImg/clear.png";

    }else if(id >= 200 && id <= 232){
        wIcon.src = "weatherImg/thunderstorm.png";

    }else if(id >= 600 && id <= 622){
        wIcon.src = "weatherImg/snow.png";

    }else if(id >= 701 && id <= 781){
        wIcon.src = "weatherImg/mist.png";

    }else if(id >= 801 && id <= 804){
        wIcon.src = "weatherImg/clouds.png";

    }else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
        wIcon.src = "weatherImg/rain.png";

    }

    //let's pass these values to a particular html element
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".Humidity span").innerText = `${humidity}%`;
    

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active")
    // console.log(info);
   }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});