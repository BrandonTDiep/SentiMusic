<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->



<!-- PROJECT LOGO -->
<!-- <br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> 

  <h3 align="center">Best-README-Template</h3>
</div> -->


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <!-- <li><a href="#working-together">Working Together</a></li> -->
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://sentimusic.onrender.com)

SentiMusic is a mood-based music recommendation system using OpenAI API to analyze user emotions, generate personalized music genres, and integrates the Spotify API to retrieve and display song recommendations based on the generated genres.



<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With


* [![React][React.js]][React-url]
* [![Express][Express.js]][Express-url]
* [![Node][Node.js]][Node-url]
* [![TailwindCSS][Tailwind]][Tailwind-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

1. Get an OPENAI API KEY or GROQ API KEY.
2. Have a Spotify Account. Spotify Premium Account recommended to access playback feature. 
3. Create a Spotify App from Spotify Web API and get client id, client secret, and callback url.
2. Create a .env in client and server directory

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/BrandonTDiep/SentiMusic.git
   ```
2. Navigate to the client and server directory. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your API keys in client directory `.env`
   ```js
   REACT_APP_API_URL = 'http://localhost:4000'
   REACT_APP_SPOTIFY_CLIENT_ID='ENTER YOUR SPOTIFY CLIENT ID'
   ```
4. Enter your API keys in server directory `.env`
   ```js
   PORT=4000
   MODEL='ENTER YOUR GPT MODEL'
   OPENAI_BASE_URL='ENTER THE OPENAI BASE URL'
   OPENAI_API_KEY='ENTER YOUR OPENAI KEY'
   OPENAI_PROMPT='ENTER YOUR OPENAI PROMPT THAT WILL GENERATE 5 GENRES FOR SPOTIFY API'
   SPOTIFY_CLIENT_ID='ENTER YOUR SPOTIFY CLIENT ID'
   SPOTIFY_CLIENT_SECRET="ENTER YOUR SPOTIFY CLIENT SECRET"
   SPOTIFY_REDIRECT_URL="ENTER YOUR SPOTIFY CALLBACK URL"
   CLIENT_REDIRECT='http://localhost:3000'


5. Run the client
   ```sh
   cd client
   npm start
   ```

6. Run the server
   ```sh
   cd backend
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Working Together  -->
<!-- ## Working Together

1. Clone the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->


<!-- ROADMAP -->
<!-- ## Roadmap

- [x] Add Changelog
- [x] Add back to top links
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
    - [ ] Chinese
    - [ ] Spanish -->


<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->



<!-- CONTRIBUTING -->
<!-- ## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/gokillboss/Projxon/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=gokillboss/Projxon" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: client/src/assets/image.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com
[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en
[Tailwind]: https://img.shields.io/badge/Tailwind_CSS-grey?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC
[Tailwind-url]: https://tailwindcss.com
