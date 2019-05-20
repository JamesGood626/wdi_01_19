window.onload = () => {
  const controller = document.querySelector(".calculatorKeys");
  const display = document.querySelector(".calculatorDisplay");
  new Calculator(controller, display);
};

const APPEND_NUM = "APPEND_NUM";
const CLEAR_DISPLAY = "CLEAR_DISPLAY";

class Calculator {
  constructor(controller, display) {
    this._controller = controller;
    this._display = new Display(display, 0, null, 0);
    this._nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    this._actions = {
      "+": function() {
        this.setOperation("+");
      },
      "-": function() {
        this.setOperation("-");
      },
      "×": function() {
        this.setOperation("×");
      },
      "÷": function() {
        this.setOperation("÷");
      },
      updateNum: function(num) {
        this.updateNum(num);
      },
      ".": function() {
        this.appendDecimal(".");
      },
      AC: function() {
        this.clearDisplay();
      },
      "=": function() {
        console.log("=");
        this.equals();
      }
    };
    this._controller.addEventListener("click", e => {
      const btn = e.target.innerHTML;
      this.fireAction(btn, this._nums, this._actions);
    });
  }

  fireAction(btn, nums, actions) {
    if (btn in nums) {
      actions["updateNum"].call(this, btn);
    } else {
      actions[btn].call(this);
    }
    console.log("this._display after action: ", this._display);
  }

  updateNum(num) {
    this._display = this._display.updateNum(num);
  }

  setOperation(operation) {
    this._display = this._display.setOperation(operation);
  }

  appendDecimal(decimal) {
    this._display = this._display.appendDecimal(decimal);
  }

  clearDisplay() {
    this._display = this._display.clearDisplay();
  }

  equals() {
    this._display = this._display.equals();
  }
}

class Display {
  constructor(display, numOne, operation, numTwo) {
    this._display = display;
    this._numOne = numOne;
    this._operation = operation;
    this._numTwo = numTwo;
    this._calculations = {
      "+": function(firstNum, secondNum) {
        return firstNum + secondNum;
      },
      "-": function(firstNum, secondNum) {
        return firstNum - secondNum;
      },
      "×": function(firstNum, secondNum) {
        return firstNum * secondNum;
      },
      "÷": function(firstNum, secondNum) {
        return firstNum / secondNum;
      }
    };
  }

  createDisplay(numOne, operation, numTwo) {
    return new Display(this._display, numOne, operation, numTwo);
  }

  clearDisplay() {
    this.updateDisplay(CLEAR_DISPLAY);
    return new Display(this._display, 0, null, 0);
  }

  updateNum(num) {
    let newNum;
    if (this._operation) {
      newNum =
        this._numTwo === 0 ? num : this.concatenateNums(this._numTwo, num);
      this.updateDisplay(APPEND_NUM, newNum);
      return this.createDisplay(this._numOne, this._operation, newNum);
    } else {
      newNum =
        this._numOne === 0 ? num : this.concatenateNums(this._numOne, num);
      this.updateDisplay(APPEND_NUM, newNum);
      return this.createDisplay(newNum, this._operation, this._numTwo);
    }
  }

  concatenateNums(firstNum, secondNum) {
    return firstNum.toString() + secondNum.toString();
  }

  setOperation(operation) {
    return this.createDisplay(this._numOne, operation, this._numTwo);
  }

  appendDecimal(decimal) {
    let decimalArr;
    if (this._numOne > 0) {
      decimalArr = this._numOne.match(/[.]/g);
      if (decimalArr < 1) {
        return this.updateNum(decimal);
      }
    } else {
      decimalArr = this._numTwo.match(/[.]/g);
      if (decimalArr < 1) {
        return this.updateNum(decimal);
      }
    }
    // Can't add multiple decimals, so we just return the
    // unchanged Display instance.
    return this;
  }

  equals() {
    const result = this._calculations[this._operation](
      parseFloat(this._numOne),
      parseFloat(this._numTwo)
    );
    this.updateDisplay(APPEND_NUM, result);
    return this.createDisplay(result, null, 0);
  }

  updateDisplay(action, ...args) {
    switch (action) {
      case APPEND_NUM:
        this._display.textContent = args[0];
        break;
      case CLEAR_DISPLAY:
        this._display.textContent = 0;
        break;
    }
  }
}
