'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Bosu Bade',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDates: [
    '2026-03-01T10:17:24.185Z',
    '2026-03-02T14:11:59.604Z',
    '2026-03-03T17:01:17.194Z',
    '2026-03-04T23:36:17.929Z',
    '2026-03-05T10:51:36.790Z',
    '2026-03-06T09:15:04.904Z',
    '2026-03-07T14:48:46.867Z',
    '2026-03-08T16:33:06.386Z',
  ],
  interestRate: 1.2, // %
  pin: 1111,
  locale: 'en-US',
  currency: 'USD',
};

const account2 = {
  owner: 'Virat Kohli',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDates: [
    '2026-03-01T10:17:24.185Z',
    '2026-03-02T14:11:59.604Z',
    '2026-03-03T17:01:17.194Z',
    '2026-03-04T23:36:17.929Z',
    '2026-03-05T10:51:36.790Z',
    '2026-03-06T09:15:04.904Z',
    '2026-03-07T14:48:46.867Z',
    '2026-03-08T16:33:06.386Z',
  ],

  interestRate: 1.5,
  pin: 2222,
  locale: 'en-GB',
  currency: 'GBP',
};

const account3 = {
  owner: 'MS Dhoni',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsDates: [
    '2026-03-01T10:17:24.185Z',
    '2026-03-02T14:11:59.604Z',
    '2026-03-03T17:01:17.194Z',
    '2026-03-04T23:36:17.929Z',
    '2026-03-05T10:51:36.790Z',
    '2026-03-06T09:15:04.904Z',
    '2026-03-07T14:48:46.867Z',
    '2026-03-08T16:33:06.386Z',
  ],
  locale: 'en-US',
  currency: 'USD',
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Suresh Raina',
  movements: [430, 1000, 700, 50, 90],
  movementsDates: [
    '2026-03-01T10:17:24.185Z',
    '2026-03-02T14:11:59.604Z',
    '2026-03-03T17:01:17.194Z',
    '2026-03-04T23:36:17.929Z',
    '2026-03-05T10:51:36.790Z',
    '2026-03-06T09:15:04.904Z',
    '2026-03-07T14:48:46.867Z',
    '2026-03-08T16:33:06.386Z',
  ],
  interestRate: 1,
  pin: 4444,
  locale: 'en-IN',
  currency: 'INR',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: new Date(acc.movementsDates.at(i)),
  }));

  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPassed(new Date(), movementDate);
    let displayDate;
    if (daysPassed === 0) {
      displayDate = 'Today';
    } else if (daysPassed === 1) {
      displayDate = 'Yesterday';
    } else if (daysPassed <= 7) {
      displayDate = `${daysPassed} days ago`;
    } else {
      const day = `${movementDate.getDate()}`.padStart(2, '0');
      const month = `${movementDate.getMonth() + 1}`.padStart(2, '0');
      const year = movementDate.getFullYear();
      displayDate = `${day}/${month}/${year}`;
    }

    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//displayMovements(account1.movements);

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)} EUR`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)} EUR`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} EUR`;
};
//calcDisplaySummary(account1.movements);

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);
console.log(accounts);

const updateUi = function (acc) {
  displayMovements(acc);
  calcPrintBalance(acc);
  calcDisplaySummary(acc);
};

// Event handler
let currentAccount;

//fake login
currentAccount = account1;
updateUi(currentAccount);
containerApp.style.opacity = 100;

//Experimenting API Internationalising
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  weekday: 'long',
};
labelDate.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //prevent form from submitting
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value,
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('Login successful');
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = `${now.getFullYear()}`;
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUi(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value,
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log('Transfer valid');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUi(currentAccount);
  }
});

//loan using some method
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username,
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
