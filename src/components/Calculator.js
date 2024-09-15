import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Calculator = () => {
    const [input, setInput] = useState('');
    const [operation, setOperation] = useState('');
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const handleClick = (value) => {
        setInput(prevInput => prevInput + value);
    };

    const handleOperation = (operation) => {
        setOperation(operation);
        setInput('');
    };

    const handleCalculate = async () => {
        if (!input || !operation) return;

        const [num1, num2] = input.split(/([+\-*/])/);

        let transformOperationName = '';

        switch (operation) {
            case '+':
                transformOperationName = 'sumar';
                break;
            case '-':
                transformOperationName = 'restar';
                break;
            case '*':
                transformOperationName = 'multiplicar';
                break;
            case '/':
                transformOperationName = 'dividir';
                break;
            default:
                transformOperationName = '';
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/calculadora/${transformOperationName}`, {
                params: {
                    numero1: parseFloat(num1),
                    numero2: parseFloat(num2),
                },
            });
            setResult(response.data);
            setInput(response.data.toString()); // Actualiza el input con el resultado
            fetchHistory(); // Refresca el historial
        } catch (error) {
            console.error('Error al realizar la operación', error);
        }
    };

    const handleClear = () => {
        setInput('');
        setOperation('');
        setResult(null);
    };

    const fetchHistory = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/calculadora/historial');
            setHistory(response.data);
        } catch (error) {
            console.error('Error al obtener el historial', error);
        }
    };

    const toggleHistory = () => {
        setShowHistory(prevShowHistory => !prevShowHistory);
        if (!showHistory) {
            fetchHistory(); // Carga el historial solo cuando se muestra
        }
    };

    useEffect(() => {
        // Optionally load history on mount if you want to
        // fetchHistory();
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-3 offset-md-4">
                    <div className="card w-75">
                        <div className="card-body">
                            <h5 className="card-title">Calculadora</h5>
                            {!showHistory && (
                                <>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)} // Añadido para manejar cambios
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <div className="btn-group d-flex flex-wrap">
                                            {[...Array(10).keys()].map(num => (
                                                <button
                                                    key={num}
                                                    className="btn btn-outline-primary m-1"
                                                    onClick={() => handleClick(num)}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                            <button
                                                className="btn btn-outline-primary m-1"
                                                onClick={() => handleOperation('+')}
                                            >
                                                +
                                            </button>
                                            <button
                                                className="btn btn-outline-primary m-1"
                                                onClick={() => handleOperation('-')}
                                            >
                                                -
                                            </button>
                                            <button
                                                className="btn btn-outline-primary m-1"
                                                onClick={() => handleOperation('*')}
                                            >
                                                *
                                            </button>
                                            <button
                                                className="btn btn-outline-primary m-1"
                                                onClick={() => handleOperation('/')}
                                            >
                                                /
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-success me-2"
                                        onClick={handleCalculate}
                                    >
                                        =
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleClear}
                                    >
                                        C
                                    </button>
                                </>
                            )}
                            <button
                                className="btn btn-info ms-2"
                                onClick={toggleHistory}
                            >
                                {showHistory ? 'Volver' : 'Historial'}
                            </button>
                            {showHistory && (
                                <div className="mt-3" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                    <h5>Historial</h5>
                                    <ul className="list-group">
                                        {history.map((operation, index) => (
                                            <li key={index} className="list-group-item">
                                                {operation.numero1} {operation.operacion} {operation.numero2} = {operation.resultado}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
