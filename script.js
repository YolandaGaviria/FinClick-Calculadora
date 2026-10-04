const calculateButton = document.getElementById("calculateButton");

const moneyFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0
});

function formatMoney(value) {
  return moneyFormatter.format(value);
}

// Convierte un campo con puntos de miles a número
function getValue(id) {
  const input = document.getElementById(id);

  if (!input || input.value.trim() === "") {
    return 0;
  }

  return Number(input.value.replace(/\./g, "")) || 0;
}

// Formatea los números mientras se escriben
function formatInput(input) {
  let value = input.value.replace(/\D/g, "");

  if (value === "") {
    input.value = "";
    return;
  }

  input.value = formatMoney(Number(value));
}

// Campos monetarios
const moneyInputs = document.querySelectorAll(
  '.calculator input[type="number"]'
);

moneyInputs.forEach((input) => {
  input.addEventListener("input", () => {
    formatInput(input);
    updateTotals();
  });
});

// Actualizar totales
function updateTotals() {
  const income = getValue("income");
  const otherIncome = getValue("otherIncome");

  const totalIncome = income + otherIncome;

  const expenseIds = [
    "housing",
    "administration",
    "utilities",
    "food",
    "cellphone",
    "subscriptions",
    "medicine",
    "bankLoans",
    "creditCards",
    "smallExpenses",
    "transport",
    "otherExpenses"
  ];

  const totalExpenses = expenseIds.reduce((total, id) => {
    return total + getValue(id);
  }, 0);

  const cashBalance = totalIncome - totalExpenses;

  document.getElementById("totalIncome").textContent =
    formatMoney(totalIncome);

  document.getElementById("totalExpenses").textContent =
    formatMoney(totalExpenses);

  document.getElementById("cashBalance").textContent =
    formatMoney(cashBalance);

  return {
    totalIncome,
    totalExpenses,
    cashBalance
  };
}

updateTotals();

calculateButton.addEventListener("click", calculateScore);

function calculateScore() {
  const {
    totalIncome,
    totalExpenses,
    cashBalance
  } = updateTotals();

  const assets = getValue("assets");
  const liabilities = getValue("liabilities");

  const bankLoans = getValue("bankLoans");
  const creditCards = getValue("creditCards");

  // Las cuotas de créditos y tarjetas forman la carga financiera
  const debtPayments = bankLoans + creditCards;

  if (totalIncome <= 0) {
    alert("Ingresa un valor mayor que cero en Ingresos mensuales.");
    return;
  }

  const allValues = [
    totalIncome,
    totalExpenses,
    cashBalance,
    debtPayments,
    assets,
    liabilities
  ];

  if (allValues.some((value) => value < 0)) {
    alert("Los valores no pueden ser negativos.");
    return;
  }

  // 1. FLUJO DE CAJA — 30 puntos
  const cashFlowPercentage =
    (cashBalance / totalIncome) * 100;

  let cashFlowScore;

  if (cashBalance <= 0) {
    cashFlowScore = 0;
  } else if (cashFlowPercentage < 5) {
    cashFlowScore = 6;
  } else if (cashFlowPercentage < 10) {
    cashFlowScore = 12;
  } else if (cashFlowPercentage < 15) {
    cashFlowScore = 18;
  } else if (cashFlowPercentage < 20) {
    cashFlowScore = 24;
  } else {
    cashFlowScore = 30;
  }

  // 2. CARGA FINANCIERA — 25 puntos
  const financialBurden =
    (debtPayments / totalIncome) * 100;

  let financialBurdenScore;

  if (financialBurden === 0) {
    financialBurdenScore = 25;
  } else if (financialBurden <= 20) {
    financialBurdenScore = 23;
  } else if (financialBurden <= 30) {
    financialBurdenScore = 20;
  } else if (financialBurden <= 40) {
    financialBurdenScore = 16;
  } else if (financialBurden <= 50) {
    financialBurdenScore = 12;
  } else if (financialBurden < 60) {
    financialBurdenScore = 8;
  } else {
    financialBurdenScore = 0;
  }

  // 3. CAPACIDAD DE AHORRO — 20 puntos
  // Se calcula a partir del saldo final de caja
  const savingCapacity = cashFlowPercentage;

  let savingCapacityScore;

  if (savingCapacity <= 0) {
    savingCapacityScore = 0;
  } else if (savingCapacity <= 5) {
    savingCapacityScore = 12;
  } else if (savingCapacity <= 10) {
    savingCapacityScore = 15;
  } else if (savingCapacity < 20) {
    savingCapacityScore = 18;
  } else {
    savingCapacityScore = 20;
  }

  // 4. PATRIMONIO NETO — 15 puntos
  const netWorth = assets - liabilities;

  let netWorthScore;

  if (assets === 0) {
    netWorthScore = 8;
  } else {
    const netWorthPercentage =
      (netWorth / assets) * 100;

    if (netWorthPercentage < 10) {
      netWorthScore = 9;
    } else if (netWorthPercentage <= 30) {
      netWorthScore = 11;
    } else if (netWorthPercentage <= 60) {
      netWorthScore = 13;
    } else {
      netWorthScore = 15;
    }
  }

  // 5. NIVEL DE ENDEUDAMIENTO — 10 puntos
  let debtLevelScore;

  if (assets === 0) {
    if (liabilities === 0) {
      debtLevelScore = 10;
    } else {
      debtLevelScore = 0;
    }
  } else {
    const debtLevel =
      (liabilities / assets) * 100;

    if (debtLevel <= 20) {
      debtLevelScore = 10;
    } else if (debtLevel <= 40) {
      debtLevelScore = 8;
    } else if (debtLevel <= 60) {
      debtLevelScore = 5;
    } else {
      debtLevelScore = 0;
    }
  }

  // PUNTAJE TOTAL
  const totalScore =
    cashFlowScore +
    financialBurdenScore +
    savingCapacityScore +
    netWorthScore +
    debtLevelScore;

  // INTERPRETACIÓN
  let interpretation;
  let interpretationText;

  if (totalScore >= 90) {
    interpretation = "Excelente salud financiera.";
    interpretationText =
      "Tu resultado indica que tienes una excelente salud financiera.";
  } else if (totalScore >= 80) {
    interpretation = "Muy buena salud financiera.";
    interpretationText =
      "Tu resultado indica que tienes una muy buena salud financiera.";
  } else if (totalScore >= 65) {
    interpretation = "Buena salud financiera.";
    interpretationText =
      "Tu resultado indica que tienes una buena salud financiera, pero existen aspectos que podrías fortalecer.";
  } else if (totalScore >= 50) {
    interpretation = "Salud financiera regular.";
    interpretationText =
      "Tu resultado muestra que hay aspectos importantes de tus finanzas que requieren atención.";
  } else {
    interpretation = "Riesgo financiero alto.";
    interpretationText =
      "Tu resultado indica que existen aspectos importantes de tus finanzas que necesitan fortalecerse.";
  }

  // SEMÁFORO
  let trafficColor;

  if (totalScore <= 59) {
    trafficColor = "red";
  } else if (totalScore <= 70) {
    trafficColor = "yellow";
  } else {
    trafficColor = "green";
  }

  // MOSTRAR RESULTADO
  document.getElementById("score").textContent =
    `${totalScore} / 100`;

  document.getElementById("interpretation").textContent =
    interpretation;

  document.getElementById("interpretationText").textContent =
    interpretationText;

  const trafficLight =
    document.getElementById("trafficLight");

  trafficLight.style.backgroundColor =
    trafficColor;

  document.getElementById("result").classList.remove("hidden");

  document.getElementById("result").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}
