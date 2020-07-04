class GoogleMap{
    static async getCurrentLocationName(){
        if (!navigator.geolocation) throw new Error("Device Not Support GPS");
        var position = await getCurrentPosition();
        var address = await geocode(position);
        var locationName = "";
        address[0].address_components.forEach((f) => {
          locationName += f.long_name + " ";
        });
        return locationName;
    }
}

function getCurrentPosition() {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  
  function geocode(position) {
    return new Promise(function(resolve, reject) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        },
        (results, status) => {
          if (status === "OK") {
            resolve(results);
          } else {
            reject(status);
          }
        }
      );
    });
  }
  export default GoogleMap;