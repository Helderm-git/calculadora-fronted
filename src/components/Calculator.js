import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Calculator = () => {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [operation, setOperation] = useState('');
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showInput2, setShowInput2] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleClick = (value) => {
        if (!showInput2) {
            setInput1(prevInput => prevInput + value);
        } else {
            setInput2(prevInput => prevInput + value);
        }
    };

    const handleOperation = (operation) => {
        setOperation(operation);
        setShowInput2(true);
        setShowResult(false);
    };

    const handleCalculate = async () => {
        if (!input1 || !input2 || !operation) return;

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
                    numero1: parseFloat(input1),
                    numero2: parseFloat(input2),
                },
            });
            setResult(response.data);
            setShowInput2(false);
            setShowResult(true);
            fetchHistory(); // Refresca el historial
        } catch (error) {
            console.error('Error al realizar la operación', error);
        }
    };

    const handleClear = () => {
        setInput1('');
        setInput2('');
        setOperation('');
        setResult(null);
        setShowInput2(false);
        setShowResult(false);
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
        fetchHistory(); // Carga el historial al iniciar
    }, []);

    return (
        <div className="container mt-4">
            <div className="row mt-5">
                <div className="col-5 offset-md-5">
                    <div className="card w-50">
                        <div className="card-body">
                            <h5 className="card-title">Calculadora</h5>
                            <div className="mb-3">
                                {!showInput2 && !showResult && (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={input1}
                                        onChange={(e) => setInput1(e.target.value)}
                                    />
                                )}
                                {showInput2 && !showResult && (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={input2}
                                        onChange={(e) => setInput2(e.target.value)}
                                    />
                                )}
                                {showResult && (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={result}
                                        readOnly
                                    />
                                )}
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
