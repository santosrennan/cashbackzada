import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

// carrega o icone da seta para esquerda do pacote feather icons
import { FiArrowLeft } from 'react-icons/fi';

// carrega a api
import api from '../../services/api';

// importa o styles local
import './styles.css';

// carrega o logo da pasta assets
import logoImg from '../../assets/logo.svg';

export default function EditIncident() {

    // instancia o history
    const history = useHistory();

    // define os states
    const [codigo_promo, setCodigo] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");

    // instancia o btnAtualizar como uma referencia
    const btnAtualizar = useRef();

    // se houver o state id na rota do history
    let id = 0;
    if (history.location.state && history.location.state.id) {
        id = history.location.state.id;
    } else {
        history.push('/profile');
    }

    useEffect(() => {
        // faz um pedido GET para a rota do backend 'profile'
        api.get(`incidents/${id}`)
        // se tiver uma resposta
        .then(response => {
            // define os incidents com o data da resposta
            setCodigo(response.data.codigo_promo);
            setTitle(response.data.title);
            setDescription(response.data.description);
            setValue(response.data.value);
        })
        .catch(err => {
            // se a pessoa não estiver logada
            if(err.response.status === 401) {
                // empurra pra pagina inicial
                history.push('/');
            }
          });
    }, [id, history]);
    
    // define a função handleUpdateIncident
    async function handleUpdateIncident(e) {
        // previne o funcionamento normal do envio do formulário
        e.preventDefault();

        // Desabilita o botao para que não seja enviado o formulário mais de uma vez
        btnAtualizar.current.setAttribute('disabled', true);

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
            await api.put(`incidents/${id}`, data);
            // direciona para página profile
            history.push('/profile');

        // se der erro
        } catch (error) {
            // libera o uso do botão novamente
            btnAtualizar.current.removeAttribute('disabled');
            // envia alerta de erro ao navegador
            alert(error.response.data.error);
            // destrava o botao
            btnAtualizar.current.removeAttribute('disabled');
        }
    }

    // imprime o jsx
    return (
        <div className="edit-incident-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Cashbackzada"/>
                    <h1>Editando produto</h1>
                    <p>
                        Altere as informações do produto.
                    </p>

                    <Link to="/profile" className="svg-link">
                        <FiArrowLeft size={16} color="#FF8C00" />
                        Voltar para o perfil
                    </Link>
                </section>
                <form 
                    id="edit-incident"
                    onSubmit={handleUpdateIncident}
                >
                     <input 
                        type="text"
                        placeholder="Código"
                        value={codigo_promo}
                        required
                        onChange={e => setCodigo(e.target.value)}
                    />    
                    <input 
                        type="text"
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
                        <button ref={btnAtualizar} className="button" type="submit">
                            Atualizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}