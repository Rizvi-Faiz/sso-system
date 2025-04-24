import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand, secondOperand, operator) => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleEquals = () => {
    if (firstOperand === null || operator === null) {
      return;
    }

    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);
    
    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Calculator App</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                {currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80">
          <div className="bg-gray-800 text-white text-right p-4 text-2xl font-mono rounded mb-4">
            {display}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => clearDisplay()}
            >
              AC
            </button>
            <button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => setDisplay(String(parseFloat(display) * -1))}
            >
              +/-
            </button>
            <button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => setDisplay(String(parseFloat(display) / 100))}
            >
              %
            </button>
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              onClick={() => handleOperator('/')}
            >
              ÷
            </button>
            
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => inputDigit('7')}
            >
              7
            </button>
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => inputDigit('8')}
            >
              8
            </button>
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => inputDigit('9')}
            >
              9
            </button>
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              onClick={() => handleOperator('*')}
            >
              ×
            </button>
            
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => inputDigit('4')}
            >
              4
            </button>
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => inputDigit('5')}
            >
              5
            </button>
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => inputDigit('6')}
            >
              6
            </button>
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              onClick={() => handleOperator('-')}
            >
              -
            </button>
            
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => inputDigit('1')}
            >
              1
            </button>
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => inputDigit('2')}
            >
              2
            </button>
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => inputDigit('3')}
            >
              3
            </button>
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              onClick={() => handleOperator('+')}
            >
              +
            </button>
            
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => inputDigit('0')}
            >
              0
            </button>
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => inputDecimal()}
            >
              .
            </button>
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              onClick={() => handleEquals()}
            >
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}