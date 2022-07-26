import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [venues, setVenues] = useState([]);
  const [location, setLocation] = useState({});

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (p) => {
        setLocation({
          lat: p.coords.latitude,
          long: p.coords.longitude,
        });
        await axios
          .post("/", {
            lat: p.coords.latitude,
            long: p.coords.longitude,
          })
          .then((response) => {
            setVenues(response.data.msg);
          })
          .catch((error) => {
            console.log("Got an error while fetching data", error);
          });
      });
    }
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div>Foursquare in Your Location</div>
        {location.lat && location.long ? (
          <div>
            ({location.lat}, {location.long})
          </div>
        ) : (
          <div>Loading location</div>
        )}
      </header>
      <div className="venues">
        {venues.length > 0 ? (
          venues.map((venue) => {
            if (venue.photo) {
              return (
                <div key={venue.id} className="venue-item">
                  <img src={venue.photo} alt="photos" />
                  <p className="venue-name">{venue.name}</p>
                </div>
              );
            }
          })
        ) : (
          <div className="header">loading...</div>
        )}
      </div>
    </div>
  );
}

export default App;
