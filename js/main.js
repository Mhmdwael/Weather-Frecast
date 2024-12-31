let data = [];
const searchInput = document.getElementById("search");
const btnFind = document.getElementById("searchBtn");
let city;
async function api() {
  let response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=5085cc25b6c24180945155057242912&q=${city}&days=3`
  );
  data = await response.json();
  displayData();
  console.log(data);
}
btnFind.addEventListener("click", function () {
  search();
});
searchInput.addEventListener("input", function () {
  city = searchInput.value.trim();
  if (city.length >= 3) {
    api();
  }
});
window.onload = function () {
  getLocation();
};
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      city = `${lat},${lon}`;
      api();
    });
  } else {
    city = "cairo";
    api();
  }
}
function displayData() {
  let cols = ``;
  for (let i = 0; i < data.forecast.forecastday.length; i++) {
    const day = data.forecast.forecastday[i];
    const date = new Date(day.date);
    const dayName = date.toLocaleString("en", { weekday: "long" });
    const maxTemp = day.day.maxtemp_c;
    const mintemp = day.day.mintemp_c;
    const condition = day.day.condition.text;
    if (i === 0) {
      cols += `
        <div class="col-sm-12 shadow col-md-6 col-lg-4">
            <div class="weather-card">
              <div class="card-border">
                <h4>${dayName}</h4>
                <h4>${date.toDateString()}</h4>
              </div>
              <h2>${data.location.name}, ${data.location.country}</h2>
              <img src="https:${day.day.condition.icon}" alt=${condition} />
                  <p>max: ${maxTemp}</p>
              <p>min: ${mintemp}</p><p>${condition}</p>
              <div class="about-geo">
          
                <p><i class="fa-solid fa-cloud"></i> ${day.day.avghumidity}%</p>
                <p><i class="fa-solid fa-wind"></i>${day.day.maxwind_kph}</p>
                <p><i class="fa-regular fa-compass"></i>  ${
                  day.day.wind_dir
                }</p>
              </div>
            </div>
          </div>`;
    } else {
      cols += `
      <div class="col-sm-12 shadow col-md-6 col-lg-4">
            <div class="weather-card2 h-100">
              <div class="card-border">
                <h4>${dayName}</h4>
              </div>
              <img src="https:${day.day.condition.icon}" alt="${condition}" />
              <p>max: ${maxTemp}</p>
              <p>min: ${mintemp}</p>
              <h5 class="pb-2">${condition}</h5>
            </div>
          </div>
        </div>
        `;
    }
  }
  document.getElementById("bodyCard").innerHTML = cols;
}

// طلب الموقع الجغرافي
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // إذا تم السماح، نحصل على إحداثيات الموقع
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // استخدام الإحداثيات للحصول على الطقس
        city = `${lat},${lon}`;
        api(); // طلب البيانات من الـ API باستخدام الإحداثيات
      },
      function () {
        // إذا رفض المستخدم، نعرض طقس مدينة افتراضية (مثال: القاهرة)
        alert(
          "تم رفض الوصول إلى الموقع الجغرافي. سيتم عرض طقس مدينة افتراضية."
        );
        city = "cairo"; // يمكن تغييرها إلى أي مدينة أخرى
        api();
      }
    );
  } else {
    alert("الـ Geolocation غير مدعوم في متصفحك.");
    city = "cairo"; // يمكن تغييرها إلى أي مدينة أخرى
    api();
  }
}
