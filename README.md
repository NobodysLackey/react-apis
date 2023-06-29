# React and APIs

![](https://madooei.github.io/cs421_sp20_homepage/assets/client-server-1.png)

## Overview

In this lesson, we'll be learning how to utilize 3rd party RESTful APIs within our React apps. We'll cover everything from installing necessary dependencies, setting up secret variables/environment variables, and setting up files to better manage shared code.

## What We'll Be Building

![preview](./public/images/preview.png)

## Getting Started

- `Fork` and `Clone`
- `cd` into this the newly created directory
- `npm install` to install our dependencies
- `npm start` to spin up our server

## Refresher

As we know, APIs allow us to interact with 3rd party libraries and data sources in order to add to our applications. There are various kinds of APIs. The API we'll be using today is an example of a [**RESTful**](https://en.wikipedia.org//wiki/Representational_state_transfer) API. REST stands for "Representational State Transfer". In other words, we request some kind of information from this external data source and it provides us, the `client`, with some information or data as a response.

## Getting Credentials For Our API

The API we'll be using today is the `TMDB` API we used earlier in the course.

This is a secured API, meaning that we need some kind of authorization token in order to request information from it.

Head over to [**your account**](https://www.themoviedb.org/login?language=en-US) to retrieve your API Key.

Once you've logged in to your account, select your profile on the top right, and then select "Settings". Navigate to the "API" section on the left hand side. Locate the `API Key (v3 auth)`. We'll be using this token to interact with the API.

## Preparing Our App

Now that we have an access token, we can get started with setting up our app.

### Installing Axios

We'll need axios again to perform our API requests. But since this is a React app, we'll install axios as a dependency. Just run `npm install axios` in the root directory *of this app*.

### Setting Global Variables

We'll now set up some global variables for axios. The base URL for the API will always be the same. The only thing that will change is the final *endpoint* for resources.

In this case, we're just going to store some variables in an external JavaScript file and import them in when we need them. This is not something you always have to do, but it's a great way to handle things like this!

Why might we only want to have ONE place where our URLs are stored in our application?

<details closed>
  <summary>Answer</summary>
   <code>Imagine a scenario where those URLs change due to some update at the source website.  What if you had 15 different locations in your app where you are making an axios call to that URL.  Now you have to go through each one to update it to the new standard. By having the URL source in one location, we ensure that we only have to update it once to have it update everywhere.</code>
</details>

In the `src` directory, create a file called `globals.js`. This is just a regular JavaScript file that we will store and export these variables from.

Add the following code to the file:

```js
export const BASE_URL = 'https://api.themoviedb.org/3'

export const POSTER_PATH = 'https://image.tmdb.org/t/p/original'
```

Our APIs base URL will never change so we'll store it in the `BASE_URL` variable. And finally, in order to view the provided images later, we'll need the URL stored in the `POSTER_PATH` variable in order to complete the image URLs. These would obviously vary depending on the API we were interacting with. They are provided here in the lesson as a time-saver. In a real-world situation, you would need to do your own research to discover what URLs you need to hit with axios to receive a certain response!

### Setting Up Our Environment Variables

Environment variables are pieces of information stored in a file that **SHOULD NOT** get pushed to GitHub. We store sensitive information like credentials or app production information here.

To set this up, create a `.env` file in the root directory of this lab with `touch .env`. Once created, it should be on the same folder level as your `package.json`. 

**THIS IS IMPORTANT. IT WILL NOT WORK INSIDE YOUR SRC FOLDER.**

We'll now add an environment variable in the `.env` file. Add the following:

```sh
REACT_APP_TMDB_KEY=<Your secret token>
```

**Note: All React environment variables must be prepended with `REACT_APP`**

**Whenever you make a change to your `.env` file, you must restart your React server for the changes to take effect.**

Finally let's make sure our `.env` file stays a secret. Add `.env` to the bottom of your `.gitignore`. This will ensure that we don't push our secret key up to GitHub when we `git push`!

## Implementing Our API Calls

In your `App.js`, let's import axios:

```js
import axios from 'axios'
```

We'll use `axios` to make our API request.

If we want our API call to be made right when our component mounts, which hook should we use to invoke our request?

<details closed>
  <summary>Answer</summary>
   <code>The <b>useEffect()</b> hook is perfect for this since it manages the three phases of the React Component lifecycle: mounted, updated, and unmounted.</code>
</details>

API requests should always be performed when our components mount, unless triggered by a user interaction. Typically with external data sources, we'll want to load them when we reach a certain point in our application. In this case, we're going to set up our app to display a list of new movies on initial load.

In your `App.js` add and import `useEffect` to your component.

Next we'll import our global axios variables. Add the following to your `App.js`:

```js
import { BASE_URL } from './globals'
```

Notice the syntax here. We're using destructuring because when we exported these variables, they get exported as an object via `export const`. This is an ES6 feature, but only supported in babel environments (like React!).

Let's set up the function inside our `useEffect` to support `async` operations. Modify your `useEffect` to the following:

```js
useEffect(() => {
  const getMovies = async () => {

  }

  getMovies()
}, [])
```

Finally, let's add in our request:

```js
useEffect(() => {
  const getMovies = async () => {
    const response = await axios.get(`${BASE_URL}/discover/movie?api_key=${process.env.REACT_APP_TMDB_KEY}`)
    console.log(response)
  }

  getMovies()
}, [])
```

The above code will make a request to the TMDB APIs `discover/movie` endpoint. This endpoint will return a list of new/popular movies.

Open your browser dev tools and take a look at the console message.

Where inside this object does the movie data we want exist?

<details closed>
  <summary>Answer</summary>
   <code>Take a look at <i>response.data.results</i>!</code>
</details>

Now we'll take the results from our axios request and store them to the state that's already been provided. Add the following to your `useEffect`:

```js
useEffect(() => {
  const getMovies = async () => {
    const response = await axios.get(`${BASE_URL}/discover/movie?api_key=${process.env.REACT_APP_TMDB_KEY}`)
    setMovies(response.data.results)
  }

  getMovies()
}, [])
```

This will store the results in our `movies` state.

Once the state get's updated, we can utilize that item in state to display our movies!

## Displaying Movies

Let's create a component to display our movies.

Create a `components` folder in the `src` directory.

In the newly created folder, create a `MovieList` component.

Set up your boilerplate for the component:

```js
const MovieList = (props) => {

  return (
    <div className="grid"></div>
  )
}
```

Import the `POSTER_PATH` variable into your `MovieList` component:

```js
import { POSTER_PATH } from '../globals'
```

Now we need a way to send some movies to this component.

How can we pass information from one component to another?

<details closed>
  <summary>Answer</summary>
   <code>If you said props, you'd be right! Props are a mechanic in React that allow us to package data into an object and pass it between our files.</code>
</details>

<br>

Go ahead and pass our `movies` state to the `MovieList` component.

Head back to your `App.js` and import your `MovieList` component:

```js
import MovieList from './components/MovieList'
```

Finally display your `MovieList` in the `return` statement of `App.js`:

```jsx
  return (
    <div>
      <MovieList />
    </div>
  )
```

Let's pass our movies state to our `MovieList` component:

```jsx
<MovieList movies={movies} />
```

We're now set up to show off our movies!

Head over to your `MovieList` component.

Let's iterate through each movie to display some information. Add the following to your `MovieList` component:

```js
{
  props.movies.map((movie) => (
    <div key={movie.id} className="card">
      <img src={`${POSTER_PATH}${movie.backdrop_path}`} alt="poster" />
      <h3>{movie.title}</h3>
      <button>View Movie</button>
    </div>
  ))
}
```

Take a look at your browser, you should now have a grid displaying some movies!

![topgun](https://c.tenor.com/I-0Zyo9JDgkAAAAC/top-gun-tom-cruise.gif)

## You Do

[TMDB API Docs](https://developers.themoviedb.org/3/getting-started/introduction)
[Deployed Version for Reference]("https://react-apis.surge.sh")

  - In your `App` component, create a function that accepts a `movieId` as a parameter and sets that `movieId` to the `selectedMovie` state.
  - In your `App` component, pass your newly created function to your `MovieList` component as a prop.
  - Over in `MovieList`, have the `button` call this function `onClick`. You will need to provide the movie id as an argument to this function when you call it.
  - Create a `MovieDetails` component.
  - In `MovieDetails`, create a state variable for `movieDetails` with the `useState()` hook.
  - Pass the `selectedMovie` state to the `MovieDetails` component and track it in a `useEffect`. Remember, you can watch `props` in the dependency array!
  - Make an axios request to the following endpoint: `${BASE_URL}/movie/${props.selectedMovie.id}` inside of the `useEffect` hook. Don't forget to add your api key to the end of the call! Might need to reference the call from earlier to get the endpoint right!
  - Finally, display the details for the selected movie in your `MovieDetails` jsx.

## Bonus

  - Build functionality to toggle which component is being displayed based on whether the `selectedMovie` state is `null` or populated.
    - **Hint**: Use `conditional rendering`!
  - Add some pagination to be able to display various pages of results!

## Recap

In this lesson, we covered the basics of integrating React and 3rd party APIs. We learned how to keep our code reusable and maintainable by using a globals.js file to consolidate our variables.

## Resources

- [Conditional Rendering](https://reactjs.org/docs/conditional-rendering.html)
- [Axios](https://github.com/axios/axios)
- [TMDB API](https://developers.themoviedb.org/3/getting-started/introduction)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
