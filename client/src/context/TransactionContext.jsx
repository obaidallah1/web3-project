/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    if (!ethereum) throw new Error("Ethereum object does not exist");
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log({
        provider,
        signer,
        transactionContract
    })
}

export const TransactionProvider = ({ children }) => {
    const [formData, setFormData] = useState({addressTo:'', amount: '', keyword: '', message: ''});
    const handleChange = (e, name) =>{
        setFormData((prevState)=>({...prevState, [name]: e.target.value}))
    }
    const [currentAccount, setCurrentAccount] = useState('')

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please installed Metamask");
            const accounts = await ethereum.request({ method: 'eth_accounts' })
            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                //getAllTransactions();
            } else {
                console.log("No accounts found")
            }
            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }

    }
    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please installed Metamask");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
    }
    const sendTransaction =  async () => {
        try {
            if (!ethereum) return alert("Please installed Metamask");
            const {addressTo, amount, keyword, message} = formData;

           const transactionContract =  getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208", //2100 gwei
                    value: parsedAmount._hex,
                }]
            })
           
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
    }
    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])
    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}