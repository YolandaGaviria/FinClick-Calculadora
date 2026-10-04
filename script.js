const calculateButton = document.getElementById("calculateButton");

calculateButton.addEventListener("click", calculateScore);

function calculateScore() {
  const income = Number(document.getElementById("income").value);
  const expenses = Number(document.getElementById("expenses").value);
  const debtPayments = Number(document.getElementById("debtPayments").value);
  const savings = Number(document.getElementById("savings").value);
  const assets = Number(document.getElementById("assets").value);
  const liabilities = Number(document.getElementById("liabilities").value);

  if (income <= 0) {
    alert("Ingresa un valor mayor que cero en Ingresos totales mensuales.");
    return;
  }

  if (
    expenses < 0 ||
    debtPayments < 0 ||
    assets < 0 ||
    liabilities < 0
  ) {
    alert("Los valores no pueden ser negativos.");
    return;
  }

  // 1. FLUJO DE CAJA — 30 puntos
  const cashFlow = income - expenses;
  const cashFlowPercentage = (cashFlow / income) * 100;

  let cashFlowScore;

  if (cashFlow < 0) {
    cashFlowScore = 0;
  } else if (cashFlowPercentage <= 5) {
    cashFlowScore = 18;
  } else if (cashFlowPercentage <= 10) {
    cashFlowScore = 22;
  } else if (cashFlowPercentage < 20) {
    cashFlowScore = 26;
  } else {
    cashFlowScore = 30;
  }

  // 2. CARGA FINANCIERA — 25 puntos
  const financialBurden = (debtPayments / income) * 100;

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
  const savingCapacity = (savings / income) * 100;

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
    const netWorthPercentage = (netWorth / assets) * 100;

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
    const debtLevel = (liabilities / assets) * 100;

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

  if (totalScore >= 90) {
    interpretation = "Excelente salud financiera.";
  } else if (totalScore >= 80) {
    interpretation = "Muy buena salud financiera.";
  } else if (totalScore >= 65) {
    interpretation = "Buena salud financiera, con oportunidades de mejora.";
  } else if (totalScore >= 50) {
    interpretation = "Salud financiera regular; requiere atención.";
  } else {
    interpretation = "Riesgo financiero alto.";
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

  // MOSTRAR RESULTADOS
  document.getElementById("score").textContent = totalScore;
  document.getElementById("interpretation").textContent = interpretation;

  document.getElementById("cashFlowScore").textContent = cashFlowScore;
  document.getElementById("financialBurdenScore").textContent =
    financialBurdenScore;
  document.getElementById("savingCapacityScore").textContent =
    savingCapacityScore;
  document.getElementById("netWorthScore").textContent = netWorthScore;
  document.getElementById("debtLevelScore").textContent = debtLevelScore;

  const trafficLight = document.getElementById("trafficLight");

  trafficLight.style.backgroundColor = trafficColor;

  document.getElementById("result").classList.remove("hidden");

  document.getElementById("result").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}
