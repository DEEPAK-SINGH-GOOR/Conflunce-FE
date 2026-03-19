import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import { setContext } from '@apollo/client/link/context';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './redux/store';
import { Provider } from 'react-redux';

// const httpLink = createHttpLink({ uri: 'http://localhost:3000/dev/graphql' });

const httpLink = createHttpLink({ uri: "http://localhost:8800/graphql" });


const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ' '
        }
    };
});
export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <Provider store={store}>
                <ToastContainer/>
                <App/>
            </Provider>
        </ApolloProvider>
    </BrowserRouter>
);
/*
import React, { useEffect, useState } from 'react'

const DynamicForm = () => {
  const defaultValue = {
    unit: "",
    weight: "",
    pieces: "",
    length: "",
    width: "",
    height: ""
  }

  const [commodites, setCommodites] = useState([defaultValue]);
  const [submitData,setSubmitData] = useState([])
  useEffect(()=>{
      const getData = localStorage.getItem('item');
      if(getData){
        setSubmitData(JSON.parse(getData))
      }
  },[])
  console.log('commodites',commodites);
  
  const handleAddForm = () => {
    const newArray = [...commodites];
    newArray.push({ ...defaultValue});
    setCommodites(newArray)
  }

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...commodites]
    updated[index][name] = value
    setCommodites(updated)
  }
  const handleRemove = (index)=>{
      const remove = commodites.filter((_,i)=>i!==index);
      setCommodites(remove);
      setSubmitData(remove);
      localStorage.setItem("item",JSON.stringify(remove));
  }
  const handleSubmit = (e)=>{
    e.preventDefault();
    const save = commodites.map((item)=> ({...item}));
    localStorage.setItem('item',JSON.stringify(save))
    setSubmitData(save)
    setCommodites([defaultValue])
  }
  const freightClassWeight = (density) => {
    let frieght;
    if (density < 0.9) {
      frieght = "400";
    } else if (density < 1.9) {
      frieght = "300";
    } else if (density < 3.9) {
      frieght = "250";
    } else if (density < 5.9) {
      frieght = "175";
    } else if (density < 7.9) {
      frieght = "125";
    } else if (density < 9.9) {
      frieght = "100";
    } else if (density < 11.9) {
      frieght = "92.5";
    } else if (density < 14.9) {
      frieght = "85";
    } else if (density < 22.4) {
      frieght = "70";
    } else if (density < 29.9) {
      frieght = "65";
    } else if (29.9 <= density) {
      frieght = "60";
    }
    return frieght;
  };
  const calculateFreightClass = (item) => {
    if (!item.length || !item.height || !item.width) return "";
    const cubeFeet = (Number(item.length) * Number(item.height) * Number(item.width)) / 1728;
    console.log("cubeFeet", cubeFeet);
    const fWeight = Number(item.weight) / (cubeFeet * Number(item.unit));
    console.log("fWeight", fWeight);
    return freightClassWeight(fWeight);
  };
  const calculateLinearFeet = (item)=>{
    if(!item.unit ||!item.weight ||!item.pieces) return "";
        const col = Math.floor(100 / Number(item.width));
        console.log('Col',col);
        const fullRows = Math.floor(Number(item.unit) / col);
        console.log('fullRows',fullRows);
        const remainingUnits = Number(item.unit) % col;
        console.log("remainingUnits", remainingUnits);
        const columnsUsedInLastRow = Math.ceil(remainingUnits / 1);
        const fullRowLinearFeet = Number(item.length) * fullRows;
        const partialRowLinearFeet =
        Number(item.length) * (columnsUsedInLastRow / col);
        return ((fullRowLinearFeet + partialRowLinearFeet) / 12).toFixed(2);
  }
  return (
    <div>
      <button onClick={handleAddForm}>+Add</button>
      <form onSubmit={handleSubmit}>
        <div>
          {commodites.map((item,index) => {
           return(
            <div key={index}>
              {/* {Object.keys(item).map((field)=>(
                <input 
                  key={field}
                  name={field}
                  value={item[field]}
                  onChange={(e)=>handleChange(index,e)}
                  placeholder={field}
                />
              ))} */}
            <input type="text"
              name='unit'
              value={item.unit}
              onChange={(e) => handleChange(index, e)}
            />
            <input type="text"
              name='weight'
              value={item.weight}
              onChange={(e) => handleChange(index, e)}
            />
            <input type="text"
              name='pieces'
              value={item.pieces}
              onChange={(e) => handleChange(index, e)}
            />
            <input type="text"
              name='length'
              value={item.length}
              onChange={(e) => handleChange(index, e)}
            />
            <input type="text"
              name='width'
              value={item.width}
              onChange={(e) => handleChange(index, e)}
            />
            <input type="text"
              name='height'
              value={item.height}
              onChange={(e) => handleChange(index, e)}
            />
            <p>Fright Class:{calculateFreightClass(item)}</p>
            <p>liner Ft:{calculateLinearFeet(item)}</p>
            <button onClick={()=> handleRemove(index)}>Remove</button>
          </div>
           )
          })}
        </div>
        <button type='submit'>Submit</button>
      </form>
      {submitData.map((item,index)=>{
        return(
          <div key={index}
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center", 
          padding: "10px",
          borderBottom: "1px solid #ccc",
        }}>
          <p>{item.unit}</p>
          <p>{item.weight}</p>
          <p>{item.pieces}</p>
          <p>{item.length}</p>
          <p>{item.weight}</p>
          <p>{item.height}</p>
          <p>Fright Class:{calculateFreightClass(item)}</p>
          <p>liner Ft:{calculateLinearFeet(item)}</p>
          //   {Object.keys(item).map((field) => (
          //   <p key={field}><strong>{field}:</strong> {item[field]}</p>
          // ))}
        </div>
        )
      })}
    </div>
  )
}

export default DynamicForm
*/
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
