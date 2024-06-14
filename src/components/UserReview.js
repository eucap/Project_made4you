import React from 'react';
import './UserReview.css';

const UserReview = ({ reviews }) => {
    return (
        <div className="user-reviews">
            <h2 className="reviews-title">User Reviews</h2>
            <div className="reviews-container">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="review">
                            <p>{review.comment}</p>
                            <p>Rating: {review.rating}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserReview;
