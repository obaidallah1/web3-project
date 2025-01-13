/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    console.log(transactionContract);
    if (!ethereum) throw new Error("Ethereum object does not exist");
    
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    
    console.log({
        provider,
        signer,
        transactionContract
    });

    return transactionContract; // Ensure we return the contract instance
};

export const TransactionProvider = ({ children }) => {
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [currentAccount, setCurrentAccount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask");
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log("No accounts found");
            }
            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object.");
        }
    };

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object.");
        }
    };

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask");
            const { addressTo, amount, keyword, message } = formData;

            const transactionContract = getEthereumContract(); // Get the contract instance
            const parsedAmount = ethers.utils.parseEther(amount);

            // This part sends the transaction directly to the Ethereum network
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208", //21000 gwei
                    value: parsedAmount._hex,
                }]
            });

            // After sending, call the addToBlockchain method on your contract
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());
            localStorage.setItem('transactionCount', transactionCount.toNumber());
        } catch (error) {
            console.log(error);
            throw new Error("Transaction failed.");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, isLoading }}>
            {children}
        </TransactionContext.Provider>
    );
};