import React, { useState } from "react";
import { Container, TextField, Button, Grid} from "@mui/material";
import "./style.css";

const Calculator = () => {
    const [input, setInput] = useState("");
    const [firstNumber, setFirstNumber] = useState(null);
    const [operator, setOperator] = useState(null);

    const handleNumberClick = (value) => {
        if (operator && input === '') {
            setInput(value);
        } else {
            setInput((prev) => prev + value);
        }
    };

    
    const directOperatorClick = (op) => {
        if (input) {
            setFirstNumber(parseFloat(input));
            setOperator(op);
            setInput("");
        }
    };

    const directEqualClick = () => {
        if (firstNumber !== null && operator && input) {
            const secondNumber = parseFloat(input);
            let answer;
            switch (operator) {
              case "+":
                answer = firstNumber + secondNumber;
                break;
              case "-":
                answer = firstNumber - secondNumber;
                break;
              case "*":
                answer = firstNumber * secondNumber;
                break;
              case "/": 
                answer = secondNumber !== 0 ? firstNumber / secondNumber : "Error";
                break;
              default:
                return;
            }
            setInput(answer.toString());
            setFirstNumber(null);
            setOperator(null);
        }
    };

    const directClear = () => {
        setInput("");
        setFirstNumber(null);
        setOperator(null);
    };

    // return (
    //     <Container maxWidth="xs" className="calculator">
    //         <TextField value = {input} variant = "outlined" fullWidth disabled />
    //         <Grid container spacing={1} className = "dials">
    //         {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map((item) => (
    //             <Grid item xs = {3} key = {item}>
    //                 <Button 
    //                     variant = "contained"
    //                     fullWidth
    //                     onClick = { () =>
    //                      item === "="
    //                         ? directEqualClick()
    //                         : ["+", "-", "*", "/"].includes(item)
    //                         ? directOperatorClick(item)
    //                         : handleNumberClick(item)
    //                     }
    //                 >
    //                     {item}
    //                 </Button>
    //             </Grid>
    //         ))}
    //         <Grid item xs={12}>
    //             <Button variant = "contained" color = "error" fullWidth onClick = {directClear}>
    //                 Clear
    //             </Button>
    //         </Grid>
    //     </Grid>
    //     </Container>

    return (
        <Container maxWidth="xs" className="calculator">
            <TextField value={input} variant="outlined" fullWidth disabled />
           
                {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map((item) => (
                    <Grid item xs={3} key={item} style={{ width: '90px' , margin: '1px'}}>

                        
                        <Button 
                            variant="contained"
                            fullWidth
                            // className = "button"
                            onClick={() =>
                                item === "="
                                    ? directEqualClick()
                                    : ["+", "-", "*", "/"].includes(item)
                                    ? directOperatorClick(item)
                                    : handleNumberClick(item)
                            }
                        >
                            {item}
                        </Button>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button variant="contained" color="error" fullWidth onClick={directClear}>
                        Clear
                    </Button>
                </Grid>
        </Container>
    );
};

export default Calculator;