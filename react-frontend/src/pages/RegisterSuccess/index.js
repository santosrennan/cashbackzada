import React from "react";
import { useHistory } from "react-router-dom";

// importa o styles local
import "./styles.css";

// carrega o logo da pasta assets
import logoImg from "../../assets/logo.svg";

export default function RegisterSuccess({ children }) {
  
  // instancia o history
  const history = useHistory();

  // exibe o jsx
  return (
    <div className="register-success-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Cashbackzada" />
          <h1> Cadastro realizado com sucesso! </h1>
          {
            // se o e-mail foi enviado exiba mensagem
          children['email'] === true ? (
            <div>
              <p>Seja bem vindo ao Cashbackzada!! Confira seu e-mail enviamos uma confirmação:</p>
              <a rel="noopener noreferrer" target="_blank" href={ 'http://'+children['email'].split('@')[1] } style={{
                  background: "#fff",
                  padding: 20,
                  textAlign: "center",
                  display: "block",
                  margin: 10,
                  fontSize: 30,
                  color: '#1e1e1f',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Abrir o { children['email'].split('@')[1].split('.')[0].toUpperCase() }
              </a>
            </div>
          )
          :
          (
            ''
          )
          }
          <button 
            className="button"
            // Utilizando history push para levar o usuario a página inicial somente para aprender
            onClick={() => history.push('/')}
          >
            Fazer logon
          </button>
        </section>
      </div>
    </div>
  );
}
