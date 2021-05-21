import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

// carrega o icone da Power e o trash2 do pacote feather icons
import { FiPower, FiEdit, FiTrash2, FiSettings , FiCheckSquare } from 'react-icons/fi';

// carrega a api
import api from '../../services/api';

// importa o styles local
import './styles.css';

// carrega o logo da pasta assets
import logoImg from '../../assets/logo.svg';

export default function Profile() {

    // instancia o history
    const history = useHistory();

    // define os states
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [updateAlert, setShowUpdateAlert] = useState(false);

    // get userName
    localStorage.getItem('userName');

    // define a função loadIncidents
    async function loadIncidents() {
        // se já tiver carregando mais incidents
        if(loading) {
            // retorne e não faça nada
            return;
        }
        
        // se o total de incidents for maior que 0 e o numero de incidents listados for igual ao total
        if (total > 0 && incidents.length === total) {
            // retorne e não faça nada
            return;
        }

        // define loading verdadeiro
        setLoading(true);

        // solicita com metodo get para a rota 'profile' do backend
        const response = await api.get('profile', {
            // define um params no pedido get chamado page com o valor da pagina atual
            params: { page }
        });

        // concatena(junta) os incidents atuais da lista junto com os incidents enviados pelo backend no data da resposta
        setIncidents([...incidents, ...response.data]);

        // pega o total de incidents do cabeçalho da resposta
        setTotal(response.headers['x-total-count']);
        
        // soma 1 a pagina atual
        setPage(page+1);

        // define loading falso
        setLoading(false);
    
    }
    
    let showUpdatedAlert = false;

    if (history.location.state && history.location.state.updated) {
        showUpdatedAlert = true;
    } else {
        showUpdatedAlert = false;
    }

    // utiliza o useEffect para carregar uma vez toda vez que for carregada a página ou se o userKey mudar
    useEffect(() => {

        // pega quando o cookie expira
        const expire = localStorage.getItem('expire_at');
        // agora
        const now = new Date();
        // diferença entre as datas
        const milliseconds = Math.abs(now - expire);
        // qnts horas faltam
        const hours = milliseconds / 36e5;
        
        // se faltar 1 hr para vencer o cookie atualiza
        if (hours > 0 && hours < 1) {
            api.put('sessions')
            .then(response => {
                localStorage.setItem('userName', response.name);
            });
        }

        // é para mostrar o updatealert?
        if (showUpdatedAlert) {
            // mostre o updatealert
            setShowUpdateAlert(true);
        }
        // faz um pedido GET para a rota do backend 'profile'
        api.get('profile', {
            // se tiver uma resposta
        }).then(response => {
            // define os incidents com o data da resposta
            setIncidents(response.data);
            // define o total tirando do cabeçalho da resposta o x-total-count
            setTotal(response.headers['x-total-count']);
            // carrega a primeira pagina e já coloca a segunda
            setPage(2);
        })
        .catch(err => {
            if(err.response.statusCode === 401) {
                // falhou login
                localStorage.setItem('expired', true);
                // vai pro login
                history.push('/');
            }
        });
    }, [showUpdatedAlert, history]);

    // define a função handleDeleteIncident
    async function handleDeleteIncident(id) {
        // bloco de declaração try, se funcionar:
        try {
            // envia como metodo delete para a rota 'incidents/:id' do backend com o id passado a função handleDeleteIncident
            await api.delete(`/incidents/${id}`);
            // filtra e remove dos incidents o incident que tiver o mesmo id do incident apagado
            setIncidents(incidents.filter(incident => incident.id !== id));

        // se der erro
        } catch (error) {
            // envia alerta de erro ao navegador
            alert('Erro ao deletar o produto, tente novamente.');
        }
    }

    
    function handleEditIncident(incident) {
        history.push('/incidents', {
            id: incident.id
        });
    }

    function handleStatusIncident(incident) {
        alert('Rebece status Back-End Boticario = “Em validação”, “Reprovado” e “Aprovado” ');
    }

    // define a função handleLogout
    async function handleLogout() {
        
        // deleta a sessao e seta o cookie nulo
        await api.delete('sessions')
        .catch(error => {
            alert(error.response.data.error);
        });
        
        // foi feito pedido de logout
        localStorage.clear();

        // empurra o cliente para a tela inicial
        history.push('/');
    }

    // exibe o jsx abaixo
    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Cashbackzada"/>
                <span>Bem vindxs, {localStorage.getItem('userName')}</span>

                <Link className="button" to="/incidents/new">
                    Cadastrar novo produto
                </Link>
                <button onClick={() => history.push('/account')} type="button">
                    <FiSettings size={18} color="#FF8C00" />
                </button>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#FF8C00" />
                </button>
            </header>

            {(updateAlert ?
                <div className="confirmUpdate">
                    Sua conta foi atualizada com sucesso.
                </div>
            :
                ''
            )}

            <h1>Produtos cadastrados</h1>

            {
            // o numero de incidents é maior que 0 ?
            (incidents.length > 0 ? // se sim exiba o jsx abaixo
                    <div>
                        <ul>
                            {
                            // faz um loop exibindo todos os 'incident' dentro da lista 'incidents'
                            incidents.map(incident => (
                                <li key={incident.id}>
                                    <span className="produto-titulo">Código:</span>
                                    <p>{incident.codigo_promo}</p>

                                    <span className="produto-titulo">Título:</span>
                                    <p>{incident.title}</p>

                                    <span className="produto-titulo">Descrição</span>
                                    <p>{incident.description}</p>

                                    <span className="produto-titulo">Valor do desconto:</span>
                                    <p>{incident.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                    <button 
                                        type="button"
                                        // emite um alerta(confirm) e chama a função handleDeleteIncident passando o id do incident do produto o usuário confirme
                                        onClick={() => handleEditIncident(incident)}
                                        style={{
                                            right: 90
                                        }}
                                    >
                                        <FiEdit size={20} color="#a8a8b3" />
                                    </button>
                                    <button 
                                        type="button"
                                        // emite um alerta(confirm) e chama a função handleDeleteIncident passando o id do incident do produto o usuário confirme
                                        onClick={(e) => { if (window.confirm('Tem certeza que quer apagar essa promoção?')) handleDeleteIncident(incident.id) }}
                                        style={{
                                            right: 60
                                        }}
                                    >
                                        <FiTrash2 size={20} color="#a8a8b3" />
                                    </button>
                                    <button 
                                        type="button"
                                        // emite um alerta(confirm) e chama a função handleDeleteIncident passando o id do incident produto o usuário confirme
                                        onClick={(e) => { if (window.confirm(' Button Mudança de status = “Em validação”, “Reprovado” e “Aprovado”')) handleStatusIncident(incident) }}
                                        style={{
                                            right: 30
                                        }}
                                    >
                                        <FiCheckSquare size={20} color="#a8a8b3" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {
                        // o total de incidents é maior que 0 e o numero de incidents exibidos é menor que o total ?
                        (total > 0 && incidents.length + 1 < total) ? // se sim mostre o jsx abaixo
                            <div className="align-center">
                                <button
                                type="button"
                                className="button"
                                // chama a função loadIncidents para carregar mais incidents
                                onClick={loadIncidents}
                                >
                                    Carregar mais
                                </button>
                            </div>
                        : // senão não mostre nada
                            ''
                        }
                    </div>
                :  // senão mostre a mensagem abaixo
                <p>Ainda não há produtos a serem exibidos.</p>
            )}
            
        </div>
    );
}