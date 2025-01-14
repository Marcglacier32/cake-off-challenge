// your code here

// Function to fetch cakes from the server and display them
function fetchCakes() {
    fetch('http://localhost:3000/cakes')
      .then(response => response.json())
      .then(cakes => {
        const cakeList = document.getElementById('cake-list');
        cakeList.innerHTML = ''; // Clear previous list
  
        cakes.forEach(cake => {
          const li = document.createElement('li');
          li.textContent = cake.name; // Display cake name
          li.dataset.id = cake.id; // Store the cake's id in a data attribute
  
          // Add Edit and Delete buttons for each cake
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.addEventListener('click', () => editCake(cake.id));
  
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', () => deleteCake(cake.id));
  
          li.appendChild(editButton);
          li.appendChild(deleteButton);
  
          // Attach click event to select cake
          li.addEventListener('click', () => selectCake(cake.id));
  
          cakeList.appendChild(li);
        });
      })
      .catch(error => console.log('Error fetching cakes:', error));
  }
  
  // Function to handle selecting a cake and populating its details
  function selectCake(cakeId) {
    fetch(`http://localhost:3000/cakes/${cakeId}`)
      .then(response => response.json())
      .then(cake => {
        // Populate cake details in the UI
        document.getElementById('cake-name').textContent = cake.name;
        document.getElementById('cake-name').dataset.id = cake.id; // Set cake ID
        document.getElementById('cake-description').textContent = cake.description;
        document.getElementById('cake-image').src = cake.image || 'assets/image-placeholder.jpg'; // Use placeholder if no image
        document.getElementById('description').value = cake.description; // Pre-fill the description form
        // You can also populate the reviews here
      })
      .catch(error => console.log('Error fetching cake details:', error));
  }
  
  // Function to handle editing a cake's name
  function editCake(cakeId) {
    const newCakeName = prompt('Enter new cake name:');
  
    if (newCakeName) {
      fetch(`http://localhost:3000/cakes/${cakeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newCakeName
        })
      })
      .then(response => response.json())
      .then(updatedCake => {
        console.log('Updated cake:', updatedCake);
        fetchCakes(); // Refresh the cake list
      })
      .catch(error => console.log('Error updating cake:', error));
    }
  }
  
  // Function to handle deleting a cake
  function deleteCake(cakeId) {
    fetch(`http://localhost:3000/cakes/${cakeId}`, {
      method: 'DELETE'
    })
    .then(() => {
      console.log('Deleted cake with id:', cakeId);
      fetchCakes(); // Refresh the cake list
    })
    .catch(error => console.log('Error deleting cake:', error));
  }
  
  // Function to handle updating cake description
  function updateCakeDescription(event, cakeId) {
    event.preventDefault();
  
    const description = document.getElementById('description').value;
  
    fetch(`http://localhost:3000/cakes/${cakeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: description
      })
    })
    .then(response => response.json())
    .then(updatedCake => {
      console.log('Updated cake description:', updatedCake);
      fetchCakes(); // Refresh the cake list
    })
    .catch(error => console.log('Error updating cake description:', error));
  }
  
  // Add event listener to the description form
  document.getElementById('description-form').addEventListener('submit', (event) => {
    const cakeId = document.getElementById('cake-name').dataset.id; // Get selected cake ID
    updateCakeDescription(event, cakeId);
  });
  
  // Function to handle adding a review
  function addReview(event, cakeId) {
    event.preventDefault();
  
    const reviewText = document.getElementById('review').value;
  
    fetch(`http://localhost:3000/cakes/${cakeId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: reviewText
      })
    })
    .then(response => response.json())
    .then(newReview => {
      console.log('Added new review:', newReview);
      fetchCakes(); // Refresh the cake list and reviews
    })
    .catch(error => console.log('Error adding review:', error));
  }
  
  // Add event listener to the review form
  document.getElementById('review-form').addEventListener('submit', (event) => {
    const cakeId = document.getElementById('cake-name').dataset.id; // Get selected cake ID
    addReview(event, cakeId);
  });
  
  // Call fetchCakes when the page loads
  document.addEventListener('DOMContentLoaded', fetchCakes);
  