import React, { useEffect, useState } from "react";
import './App.css';

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(()=> {
    getTransactions().then(transactions => {
      setTransactions(transactions);
    })
  }, [transactions]);
  //added state transactions so that whenever new transactiosn is added page is refreshed and the frontend only updates when page refreshed

  const getTransactions = async() => {
    // this url is to get and display transaction to frontend from posted data in backend and db
    const URL = process.env.REACT_APP_API_URL+"/transactions";
    const response = await fetch(URL);
    return await response.json();
  }

  const addNewTransaction = (e) => {
    e.preventDefault();
    // this url is to get post data through from to the backend and db 
    const URL = `${process.env.REACT_APP_API_URL}/transaction`;
    console.log(URL);
                        //separator is space 
    const price = name.split(" ")[0];
    fetch( URL, {
      method: "POST",
      headers: {"Content-type":"application/json"},
      body: JSON.stringify({
        price, 
        name: name.substring(price.length + 1),
        description, 
        datetime
      })
    })
    .then(response => {
      response.json()
      .then(json => {
        setName("");
        setDescription("");
        setDatetime(""); 
        console.log("result", json);
      });
    });
  }

  //Number
  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  //String         //two decimal points (including both dollars and cents)
  balance = balance.toFixed(2);
  // to get cents(values after decimal point)
  const cents = balance.split(".")[1];
  //to get only dollar without cents(value before decimal points)
  balance = balance.split(".")[0];


  return (

    <main>

      <h1>${balance}<span>{cents}</span></h1>

      <form onSubmit={addNewTransaction}>

        <div className="basic">
          <input type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 placeholder={"+200 new samsung tv"}
          />
          <input type="datetime-local"
                 value={datetime}
                 onChange={(e) => setDatetime(e.target.value)} 
          />
        </div>

        <div className="description">
          <input type="text"
                 value={description}
                 onChange={(e) => setDescription(e.target.value)} placeholder={"description"} 
          />
        </div>

        <button type="submit">Add new transaction</button>

      </form>

      <div className="transactions">

        { transactions.length > 0 && transactions.map((transaction, index) => (

          <div key={index} className="transaction">

            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>

            <div className="right">
              <div className={"price " + (transaction.price < 0 ? "red" : "green")} >{transaction.price}</div>
              <div className="datetime">{transaction.datetime}</div>
            </div>

          </div>

        ))}

      </div>

    </main>

  );
}

export default App;
