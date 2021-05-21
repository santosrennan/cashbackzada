import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

// carrega o icone da seta para esquerda do pacote feather icons
import { FiArrowLeft } from "react-icons/fi";

// carrega a página RegisterSuccess
import RegisterSuccess from '../RegisterSuccess';

//componenet de mascara de cpf
import CpfCnpj from "@react-br-forms/cpf-cnpj-mask";

// carrega a api
import api from '../../services/api';

// importa o styles local
import './styles.css';

// carrega o logo da pasta assets
import logoImg from '../../assets/logo.svg';

// import json estados e cidades
import { estados } from '../../assets/estados-cidades.json';

export default function Register() {
  // define um state para ver se o registro obteve sucesso ou não
  const [successRegistration, setSuccessRegistration] = useState(false);
  // define um stage para ver se o email foi enviado ou não
  const [sentEmail, setSentEmail] = useState(false);

  // define os states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [password, setPassword] = useState("");
  const [citiesJSON, setCitiesJSON] = useState([]);

  // instancia o btnRegister como uma referencia
  const btnRegister = useRef();
 
  // define a função handleRegister
  async function handleRegister(e) {
    // previne o funcionamento normal do envio do formulário
    e.preventDefault();

    // Desabilita o botao para que não seja enviado o formulário mais de uma vez
    btnRegister.current.setAttribute('disabled', true);

    // armazena os states dentro da variavel data
    const data = {
      name,
      email,
      cpf,
      whatsapp,
      city,
      uf,
      password
    };

    // bloco de declaração try, se funcionar:
    try {
      // envia os dados do formulário como metodo post para a rota 'users' do backend
      const response = await api.post('users', data);
      // verifica se o e-mail foi enviado
      if (response.data.email === true) {
        setSentEmail(true);
      }
      // define o state successRegistration como verdadeiro
      setSuccessRegistration(true);

    // se der erro
    } catch (error) {
      // define o state successRegistration como falso
      setSuccessRegistration(false);
      // envia alerta de erro ao navegador
      alert(error);
      // destrava o botao
      btnRegister.current.removeAttribute('disabled');
    }
  }

  function handleSelectState(uf) {
    // recebe o UF do e.target.value e define o UF
    setUf(uf);
    // filtra entre os estados do json o estado que tenha a sigla === uf
    const estadoSelecionado = estados.filter(estado => estado.sigla === uf);
    // define a cidade selecionada como o estado[0]['cidades'] para popular o select city
    setCitiesJSON(estadoSelecionado[0]['cidades']);
  }

  // se o registro foi um sucesso
  if (successRegistration) {
    // exibe este jsx com a página RegisterSuccess com um children da user_key
    return (
      <RegisterSuccess>
        {{email, sentEmail}}
      </RegisterSuccess>
    );
    
  // se não tiver feito ainda o registro ou não foi um sucesso exiba ou mantenha este jsx
  } else {
    return (
      <div className="register-container">
        <div className="content">
          <section>
            <img src={logoImg} alt="Cashbackzada" />
            <h1> Cadastro </h1> <p>Faça seu cadastro, entre na plataforma =) </p>
            <Link to="/" className="svg-link">
              <FiArrowLeft size={16} color="#FF8C00" />
              Voltar para o logon
            </Link>
          </section>
          <form onSubmit={handleRegister}>
            <input
              placeholder="Seu nome é..."
              value={name}
              required
              onChange={e => setName(e.target.value)}
            />
            <input 
              type="email" 
              placeholder="e o seu e-mail?" 
              value={email} 
              required
              onChange={e => setEmail(e.target.value.toLowerCase())}
              style={{
                textTransform: 'lowercase'
              }}
            />
            <CpfCnpj 
              placeholder="Informe seu CPF" 
              value={cpf} 
              required
              onChange={e => setCpf(e.target.value)}
            />
            <input 
              type="tel" 
              placeholder="seu número de telefone | whatsapp ..."
              value={whatsapp} 
              required
              minLength={10}
              maxLength={11}
              onChange={e => setWhatsapp(e.target.value)}
            />
            <div className="input-group">
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                required
              >
                {citiesJSON.length > 0 ? 
                  <option hidden>Qual é sua cidade</option>
                :
                  <option hidden> ... </option>
                }
                {citiesJSON.length > 0 ? 
                  citiesJSON.map(cidade => (
                    <option
                      key={cidade}
                      value={cidade}>{cidade}</option>
                  ))
                :
                  ''
                }
              </select>
              <select
                value={uf}
                required
                onChange={e => handleSelectState(e.target.value)}
                style={{
                  width: 130
                }}
              >
                <option hidden>UF</option>
               {estados.map(estado => (
                  <option
                    key={estado.sigla}
                    value={estado.sigla}
                  >{estado.sigla}</option>
               ))}
              </select>
            </div>
            <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder='Defina uma senha'
          />
            <button ref={btnRegister} className="button" type="submit">
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    );
  }
}
