import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  // Set Default State
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Mot de passe ou identifiant incorrect")

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    // Verification Empty form - return error if empty
    if (username === '' || password === '') {
      setErrorMessage("Les champs ne peux pas être vide")
      return setLoginError(true)
  } else {
      setErrorMessage("Mot de passe ou identifiant incorrect")
      setLoginError(false)
  }

    const loginResponse = await fetch("http://localhost:3010/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ username, password }),
    });

    // si la réponse est valide
    if (loginResponse.status === 200) {
      const loginData = await loginResponse.json();

      // je récupère le jwt dans le data
      const jwt = loginData.data;

      // je stocke le jwt dans un cookie
      Cookies.set("jwt", jwt);

      // on récupère le username dans le jwt
      // on récupère toutes les infos de l'user via l'api
      // en fonction du rôle récupéré avec l'appel fetch
      // on redirige vers l'accueil admin si le role est admin ou editor
      // sinon on redirige vers l'accueil public

      const user = jwtDecode(jwt);

      if (user.data.role === 3 || user.data.role === 2) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else{
      setLoginError(true)
    }
  };

  return (
    <>
      <header className="App-header">
      <nav className="App-nav header-nav">
        <ul>
          <li>
            <p><Link to={"/"}>Retour à Accueil</Link></p>
          </li>
          <li>
            <p>S'inscrire</p>
          </li>
          <li>
            <p></p>
          </li>
        </ul>
      </nav>
    </header>
    <main className="App-main">
      <form className="App-container App-form login" onSubmit={handleLoginSubmit}>
          <div className="App-nav">
            <label htmlFor="username">Username:</label>
            <input type="text" name="username"/>
          </div>
          <div className="App-nav">
            <label htmlFor="password">Password: </label>
            <input type="password" name="password" />
          </div>
          <input className="App-container App-nav App-btn" type="submit" />
      </form>
      {loginError && (
                        <div className="error container text-bg-danger text-center">{errorMessage}</div>
                    )}
    </main>
    </>
    
  );
};

export default LoginPage;
