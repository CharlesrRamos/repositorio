import React, {useState, useCallback, useEffect} from 'react'
import {FaGithub, FaPlus, FaSpinner,FaBars, FaTrash} from 'react-icons/fa'
import {Container, Form, SubmitButton, List,DeleteButton} from './styles'

import api from '../../services/api'
import { Link } from 'react-router-dom';


export default function Main(){

  const [newRepo, setNewRepo] = useState('');

  const [repositorio, setRepositorio] = useState([]);

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(null)

  //didMotn = Buscar
   useEffect(()=>{
     const respoStorage = localStorage.getItem('repos');

     if(respoStorage){
       setRepositorio(JSON.parse(respoStorage));
     }
   },[])

  //DidUpdade = salvar alterações

   useEffect(()=>{
     localStorage.setItem('repos', JSON.stringify(repositorio));
   },[repositorio]);


  const handleSubmit = useCallback((e)=>{

    e.preventDefault();

    async function submit(){
      setLoading(true);
      setAlert(null);
      try{
        
        if(newRepo === ''){
          throw new Error('Você precisa indicar um repositório');
        }
         const response = await api.get(`repos/${newRepo}`)

         const hasRepo = repositorio.find(repo => repo.name === newRepo)
        
         if(hasRepo){
           throw new Error('Repositório Duplicado')
         }
         const data = {
           name: response.data.full_name,
    }

        setRepositorio([...repositorio, data]);
         setNewRepo('');

      }catch(error){
        setAlert(true)
        console.log(error);
      }finally{
        setLoading(false);
      }

  }

  

    submit();
    
  }, [newRepo, repositorio]);

  function handleInputChange(e){
    setNewRepo(e.target.value)
    setAlert(null)
  }

  const handleDelete = useCallback((repo)=>{
      const find = repositorio.filter(r => r.name !== repo)
      setRepositorio(find);
  },[repositorio])


  return(
    <Container>
      <h1>
        <FaGithub size={25}/>
        Meus Repositorios
      </h1>

      <Form onSubmit ={handleSubmit} error= {alert}>
        <input type='text' placeholder='Adcionar Repositorio'
        value={newRepo}
        onChange={handleInputChange}/>

        <SubmitButton loading={loading ? 1 : 0}>
          {
            loading ? (
              <FaSpinner color= '#FFF' size={14}/>
            ) : (
              <FaPlus color= '#FFF' size={14}/>
            )
          }
          
        </SubmitButton>
      </Form>

      <List>
        {repositorio.map(repo =>(
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={()=>handleDelete(repo.name)}>
                <FaTrash size={14}/>
              </DeleteButton>

              {repo.name}</span>
            <Link to={`/repositorio/${encodeURIComponent(repo.name) }`}>
              <FaBars size={20}/>
            </Link>
          </li>
        ))}
      </List>


    </Container>
  )
}

// quando encadear mais de duas tags, criar novo componente, 
//se você quiser manipular deve-se criar um componente