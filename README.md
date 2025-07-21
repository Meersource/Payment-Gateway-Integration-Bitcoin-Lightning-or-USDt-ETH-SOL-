# Crypto Payment Integration API (Node.js + OpenNode)

A backend API built with **Node.js**, **Express**, and **MongoDB** that supports user authentication and cryptocurrency payments using the **OpenNode** platform.

---

## ✅ Features

- User Registration & Login with JWT Authentication
- Secure Password Hashing using Bcrypt
- Create Crypto Payment Requests via OpenNode
- Webhook Support to Track Payment Status
- MongoDB Integration using Mongoose
- Error Handling Middleware
- Async Middleware to Simplify Try/Catch

---

## Envirnment variables
COINBASE_API_KEY=c208c6ed-0c0e-4566-bfdc-7b16c651ed07
PORT=3000
MONGO_URI=mongodb+srv://meerhamza6:6430532aa@cluster0.wvqzf.mongodb.net/crypto-payment
JWT_SECRET =meerhamza545dfgjvgjr
JWT_EXPIRE =30d
OPENNODE_API_KEY=f352f933-d55c-40b4-942c-a9561fb2efe3

## 🛠️ Setup Instructions
clone this repo https://github.com/Meersource/Payment-Gateway-Integration.git
and switch to branch open_node
initilize ngrok :npx ngrok http 3000
and add ngrok public url link into paymentController -> createPayment -> callback_url for webhook response
i test sandbox payment through this website https://coinfaucet.eu/en/btc-testnet/

i have account on https://app.dev.opennode.com/dashboard
email: meerhamza.mh44@gmail.com
password: 6430532aa

### Prerequisites

- Node.js v14+
- MongoDB (local or cloud - MongoDB Atlas)
- OpenNode Developer Account (https://dev.opennode.com/)

---

### Installation

**Clone the Repository**

git clone  https://github.com/Meersource/Payment-Gateway-Integration.git
and switch to branch open_node


## Reasons for Choosing OpenNode & Lightning Network

OpenNode provides a clean and well-documented API with support for:
  Webhooks for status updates
  Sandbox/test environment for development
  No need to manage wallets, smart contracts, or deal with blockchain-level operations like in Fireblocks or Ethereum-based integrations.
  OpenNode handles wallet infrastructure securely 