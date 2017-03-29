## automotive-services-search-reactjs

This is a simple SPA (single page application) designed to help drivers find nearby automotive services.

The system is built using React JS framework.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!


          /*
            <GoogleMapLoader
              containerElement={
                <div
                  {...this.props}
                  style={{
                    height: "100%",
                  }}
                />
              }
              googleMapElement={
                <GoogleMap
                  ref={(map) => console.log(map)}
                  defaultZoom={15}
                  defaultCenter={{lat: this.state.lat, lng: this.state.lng}}
                  onClick={() => alert("mapClick")}>
                </GoogleMap>
              }
            />
            */