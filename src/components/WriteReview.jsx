import React, { useState } from 'react';
import './App.css';

const WriteReview = ({ restaurant, navigateBack }) => {
    const [rating, setRating] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:3000/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rtr_id: restaurant.rtr_id,
                rv_rating: parseInt(rating, 10), // Ensure rating is an integer
                rv_comment: comments,
                c_id: 1, // Replace with the actual customer ID
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to submit review');
                }
                return res.json();
            })
            .then((data) => {
                alert('Thank you for your valuable response!');
            })
            .catch((err) => {
                console.error('Error submitting review:', err);
                alert('Failed to submit review. Please try again.');
            });
    };

    return (
        <div className="form-container">
            <h2>Write a Review for {restaurant.rtr_name}</h2>
            <form className="review-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Rating (1-5):</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Comments:</label>
                    <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        required
                    />
                </div>
                <div className="button-group">
                    <button className="form-button" type="submit">Submit</button>
                    <button
                        className="form-button secondary"
                        type="button"
                        onClick={navigateBack}
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WriteReview;
