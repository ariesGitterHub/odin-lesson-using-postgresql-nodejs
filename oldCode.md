      <div class="search-results-container">
        <!-- <div class="inner-container"> -->
        <% if (!q.firstName && !q.lastName && !q.email) { %>
        <!-- No search yet -->
        <p>Please begin a search above...</p>
        <% } else if (q && users && users.length > 0) { %>
        <!-- Search has results -->
        <h2 class="search-results-title">Search Results...</h2>
        <div class="search-results">
          <% users.forEach(user => { %>
          <p class="name-result"><%= user.firstName %> <%= user.lastName %></p>
          <p class="email-result">&#11046; Email: <%= user.email %></p>
          <% if (user.age) { %>
          <p class="age-result">&#11046; Age: <%= user.age %></p>
          <% } %> <% if (user.bio) { %>
          <p class="bio-result">Bio: <%= user.bio %> <% } %></p>
          <hr />
          <% }) %>
        </div>
        <% } else if (q.firstName || q.lastName || q.email) { %>
        <!-- Search performed but no results -->
        <p>No users found for "<%= q.firstName || q.lastName || q.email %>"</p>
        <% } %>
      </div>

      CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  email VARCHAR(255),
  age INTEGER,
  bio TEXT
);
