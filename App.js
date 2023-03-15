import { useEffect, useState } from 'react';
import { GiftedChat, Send, Icon } from 'react-native-gifted-chat';
import Web3 from 'web3';
import 'tailwindcss/tailwind.css';
import { TextInput, View } from 'react-native';



const [userAddress, setUserAddress] = useState("");
const [messages, setMessages] = useState([]);


// Replace the ABI with yours
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "text",
				"type": "string"
			}
		],
		"name": "NewMessage",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "messages",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "text",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "text",
				"type": "string"
			}
		],
		"name": "sendMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

// Replace the contract address
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"
// Replace this with datahub API
const web3 = new Web3('https://celo-testnet--rpc--alfajores.datahub.figment.io/apikey/<YOUR_API_KEY>/');

useEffect(() => {
  // Subscribe to new message events
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  contract.events.NewMessage({}, (error, event) => {
    if (!error) {
      const { sender, text, timestamp } = event.returnValues;
      setMessages(prevMessages => GiftedChat.append(prevMessages, [{
        _id: Math.random().toString(36).substring(7),
        text,
        createdAt: new Date(timestamp * 1000),
        user: {
          _id: sender,
          name: sender,
        },
      }]));
    }
  })
  async function requestAccount() {
    const accounts = await web3.eth.requestAccounts();
    setUserAddress(accounts[0]);
  }
  requestAccount();
}, []);

async function handleSend(messages) {
  const text = messages[0].text.trim();
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  await contract.methods.sendMessage(text).send({ from: userAddress });
}
 
<GiftedChat
  messages={messages}
  user={{ _id: userAddress, name: userAddress }}
  onSend={handleSend}
  placeholder="Type your message here..."
  renderComposer={(props) => (
      <TextInput
        {...props}
        style="w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )}
    renderSend={(props) => (
      <Send {...props}>
        <View style="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500">
          <Icon name="send" size={24} color="#fff" />
        </View>
      </Send>
    )}
    messagesContainerStyle="flex-1 bg-gray-100"
  />
