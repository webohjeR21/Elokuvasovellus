import React, { useState } from 'react';
import './RateMovies.css';

export default function RateMovies() {
  const [reviews, setReviews] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const rating = formData.get('rating');
    const comment = formData.get('comment');

    console.log('Arvosana:', rating);
    console.log('Kommentti:', comment);

    const newReview = {
      rating: rating,
      comment: comment
    };

    setReviews([...reviews, newReview]);
  };

  return (
    <div>
      <h2>Arvostele elokuva</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Arvosana:</label>
          <select name="rating">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <div>
          <label>Kommentti:</label>
          <textarea name="comment" />
        </div>
        <button type="submit">Lähetä</button>
      </form>
      <div>
        <h3>Arvostelut:</h3>
        {reviews.map((review, index) => (
          <div key={index}>
            <p>Arvosana: {review.rating}</p>
            <p> {review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}