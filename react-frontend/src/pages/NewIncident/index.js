import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';

// carrega o icone da seta para esquerda do pacote feather icons
import { FiArrowLeft } from 'react-icons/fi';

// carrega a api
import api from '../../services/api';

// importa o styles local
import './styles.css';

// carrega o logo da pasta assets
import logoImg from '../../assets/logo.svg';

export default function NewIncident() {

    // instancia o history
    const history = useHistory();

    // define os states
    const [codigo_promo, setCodigo] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");

    // instancia o btnRegister como uma referencia
    const btnRegister = useRef();

    // verifica se existe o userName no localstorage senao envia para pagina inicial
    const userName = localStorage.getItem('userName');
    if(!userName) {
        history.push('/');
    }

    // define a função handleNewIncident
    async function handleNewIncident(e) {
        // previne o funcionamento normal do envio do formulário
        e.preventDefault();

        // Desabilita o botao para que não seja enviado o formulário mais de uma vez
        btnRegister.current.setAttribute('disabled', true);

        // armazena o title, description, value dentro da variavel data
        const data = {
            codigo_promo,
            title,
            description,
            value,
        };

        // bloco de declaração try, se funcionar:
        try {
            // envia os dados do formulário como metodo post para a rota 'incidents' do backend
            await api.post('incidents', data)
            .catch(err => {
                // se a pessoa não estiver logada
                if(err.response.status === 401) {
                    // empurra pra pagina inicial
                    history.push('/');
                }
              });
            // direciona para página profile
            history.push('/profile');

        // se der erro
        } catch (error) {
            // libera o uso do botão novamente
            btnRegister.current.removeAttribute('disabled');
            // envia alerta de erro ao navegador
            alert(error.response.data.error);
            // destrava o botao
            btnRegister.current.removeAttribute('disabled');
        }
    }

    // imprime o jsx
    return (
        <div className="new-incident-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Cashbackzada"/>
                    <h1>Cadastrar novo produto</h1>
                    <p>
                        Descreva a promoção detalhadamente.
                    </p>

                    <Link to="/profile" className="svg-link">
                        <FiArrowLeft size={16} color="#FF8C00" />
                        Voltar para o perfil
                    </Link>
                </section>
                <form 
                    id="new-incident"
                    onSubmit={handleNewIncident}
                >
                     <input 
                        type="text"
                        placeholder="Código do Produto"
                        value={codigo_promo}
                        required
                        onChange={e => setCodigo(e.target.value)}
                    />  
                    <input 
                        placeholder="Título da promoção"
                        value={title}
                        required
                        onChange={e => setTitle(e.target.value)}
                    />
                    <textarea 
                        placeholder="Descrição"
                        value={description}
                        required
                        onChange={e => setDescription(e.target.value)}
                    />
                    <input 
                        type="number" 
                        placeholder="Valor em reais"
                        value={value}
                        required
                        min={0}
                        onChange={e => setValue(e.target.value)}
                    />
                    <div className="button-group">
                        <button className="button cancelar" type="button" onClick={() => {
                            document.getElementById("new-incident").reset()
                        }}>
                            Limpar
                        </button>
                        <button ref={btnRegister} className="button" type="submit">
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}