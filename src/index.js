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
import React, { useState } from "react";

const DynamicForm = () => {
    const [forms, setForms] = useState([
        { firstName: "", lastName: "", email: "", phone: "" }
    ]);
    const [submit, setSubmit] = useState([])

    const handleAddForm = () => {
        setForms([...forms, { firstName: "", lastName: "", email: "", phone: "" }]);
    };

    const handleDelete = (index) => {
        setForms(forms.filter((_, i) => i !== index));
    };

    const handleChange = (index, e) => {
        const newForms = [...forms];
        newForms[index][e.target.name] = e.target.value;
        setForms(newForms); // live update as you type
    };
    const handleSubmit = () => {
        setSubmit(forms)
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Dynamic Forms</h2>
            <button onClick={handleAddForm}>+ Add</button>

            {forms.map((form, index) => (
                <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={(e) => handleChange(index, e)}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={(e) => handleChange(index, e)}
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => handleChange(index, e)}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) => handleChange(index, e)}
                    />
                    <button onClick={() => handleDelete(index)} style={{ marginTop: "5px" }}>Delete</button>
                </div>
            ))}
            <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
                Submit All
            </button>
            {submit.map((form, index) => (
                <div key={index} style={{
                    border: "1px solid green",
                    padding: "10px",
                    margin: "5px 0",
                    backgroundColor: "#f0fff0"
                }}>
                    <p>First Name: {form.firstName}</p>
                    <p>Last Name: {form.lastName}</p>
                    <p>Email: {form.email}</p>
                    <p>Phone: {form.phone}</p>
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
