# Basic React

- Using the _data.js_ file provided in public, create an interface that displays a card-like array of the 6 movies listed in there. Use the poster of every entry for the card and put the name of the movie and the year in the description of the card.
- Let the card have a link or button that says "More...", when clicked, you must display below the cards a section containing the image, name and bio of the most prominent character of the movie as stated in the _data.js_ file.
- When hovering over the card of the movie, the image should change to display the logo of the affiliation of the main character as per its data. When it is a good affiliation, the color should be blue and when it is an evil one it should be red.
- The card should also have a like and dislike button that should keep track of the overall appreciation of the movie by the users.
- When the subsection of the detail of the movie is shown, the users should see a form that grants them the possibility of adding a comment to that section. These comments should be kept for the duration of the session, in other words, this should not be saved between sessions. Every entry should have name and comment.

## Design Choices

### Component Structure

The application is broken down into several reusable components:

- **`App.jsx`**: The main component that orchestrates the entire application. It manages the state for likes, dislikes, comments, and the currently selected movie.
- **`MovieList.jsx`**: This component is responsible for rendering the list of movie cards. It takes the list of movies as a prop and maps over them, rendering a `MovieCard` for each one.
- **`MovieCard.jsx`**: This component displays a single movie card. It shows the movie's poster, title, year, and like/dislike buttons. It also handles the hover effect to change the image to the character's affiliation logo.
- **`CharacterDetails.jsx`**: This component displays the details of the selected movie's main character, including their image, name, and bio. It also contains the comment section.
- **`CommentForm.jsx`**: This component provides a form for users to add comments about the movie.
- **`CommentList.jsx`**: This component displays the list of comments for the selected movie.

### Styling

The application is styled using **Tailwind CSS**. This choice was made to rapidly build a modern and responsive user interface without writing custom CSS. Tailwind's utility-first approach allows for easy customization and consistency across the application.

### State Management

The application's state is managed using React's built-in `useState` hook. This includes:

- **Likes and Dislikes**: The number of likes and dislikes for each movie is stored in an object in the `App` component's state. The keys of the object are the movie episode numbers, and the values are the number of likes or dislikes.
- **Selected Movie**: The currently selected movie for displaying character details is stored in the `App` component's state.
- **Comments**: The comments for each movie are stored in an object in the `App` component's state. The keys of the object are the movie episode numbers, and the values are an array of comment objects. This data is stored in the session and is not persisted between sessions.
