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
import React, { useState, useEffect } from "react";

const DynamicForm = () => {
  const [forms, setForms] = useState([
    { firstName: "", lastName: "", email: "", phone: "" },
  ]);

  // Load forms from localStorage on component mount
  useEffect(() => {
    const savedForms = localStorage.getItem("formsData");
    if (savedForms) {
      setForms(JSON.parse(savedForms));
    }
  }, []);

  // Save forms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("formsData", JSON.stringify(forms));
  }, [forms]);

  // Add a new empty form
  const handleAddForm = () => {
    setForms([...forms, { firstName: "", lastName: "", email: "", phone: "" }]);
  };

  // Update form values
  const handleChange = (index, e) => {
    const newForms = [...forms];
    newForms[index][e.target.name] = e.target.value;
    setForms(newForms);
  };

  // Delete a form
  const handleDelete = (index) => {
    const newForms = forms.filter((_, i) => i !== index);
    setForms(newForms);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dynamic Forms</h2>

      <button onClick={handleAddForm}>+ Add Form</button>

      {forms.map((form, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => handleChange(index, e)}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => handleChange(index, e)}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange(index, e)}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => handleChange(index, e)}
          />
          <button onClick={() => handleDelete(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;
*/
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
