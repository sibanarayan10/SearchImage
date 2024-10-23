# searchImage

## Overview
searchImage is a full-stack MERN-based application that allows users to upload, manage, and search for images efficiently. The application utilizes Google OAuth 2.0 for secure user authentication and employs various technologies for enhanced performance and user experience.
![Project Preview](assets/image2.png)
![Project Preview](assets/image1.png)


## Features
- **User Authentication**: Users can sign up and log in using Google OAuth 2.0, ensuring secure access.
- **JWT Security**: JSON Web Tokens are used to secure routes and protect user data.
- **Environment Variables**: Sensitive information such as API keys and database credentials are stored in a `.env` file.
- **Search Functionality**: 
  - Supports **partial search** to find images based on keywords.
  - Handles **faulty searches** gracefully, providing relevant results even with typos.
  - Uses **MongoDB text indexing** for optimized search results.
- **Caching**: Implements **Redis** for caching images, which improves response times and reduces load on the database.
- **Image Management**: Users can upload and delete their own photos.
- **Cloudinary Integration**: Large files are stored on Cloudinary, ensuring scalability and performance.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **File Storage**: Cloudinary
- **Authentication**: Google OAuth 2.0, JWT

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/searchImage.git
   cd searchImage
