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

### To-do

 - Handle marker click and show information in a more elegant way than alert.
 - Keep user's decision about the sorting method when requesting new informations to the api.
 - Design better UI for the places list item component.
 - Design better app UI for mobile devices portrait mode.
 - Handle user input errors (like empty address or alpha chars in radius).
 - Handle Google database failures like incomplete vicinities such as "Brazil" or "São Paulo".
 - Handle Google api failures like places that don't get returned after you increase radius.
 - Discover if Google's distance rank top varies with radius because it is wrong or because places disappeared.
 - Remove unused code.
 - Add more comments to the code.