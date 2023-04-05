document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  const submitButton = document.getElementById("submit");
  const inputPass = document.getElementById("passUser");
  const outputElement = document.getElementById("bruteForceOutput");
  const useSameLength = document.getElementById("sameLength");
  const useSpecialCharacters = document.getElementById("useSpecialCharacters");
//   const minPassLength = document.getElementById("minPassLength");
  const maxPassLength = document.getElementById("maxPassLength");

  let passwordHistory = [];
  let totalAttempts = 0;
  let numOfRuns = 0;

  const passwordHistoryTable = document.querySelector(
    "#passwordHistoryTable tbody"
  );

  const longestAttemptsElement = document.getElementById("longestAttempts");
  const shortestAttemptsElement = document.getElementById("shortestAttempts");
  const averageAttemptsElement = document.getElementById("averageAttempts");

  submitButton.addEventListener("click", function () {
    bruteForceAttack(useSameLength.checked, useSpecialCharacters.checked);
  });

  function bruteForceAttack(useSameLength, useSpecialCharacters) {
    const maxLength = useSameLength
      ? inputPass.value.length
      : parseInt(maxPassLength.value);
    let found = false;
    let generatedPass = "";
    let attemptCount = 0;
    const attemptCountElement = document.getElementById("attemptCount");

    function tryPassword(passwordLength) {
      if (passwordLength <= maxLength) {
        generatedPass = generateRandomPassword(
          passwordLength,
          useSpecialCharacters
        );
        outputElement.textContent = generatedPass;
        attemptCount++;
        attemptCountElement.textContent = attemptCount;

        if (generatedPass === inputPass.value) {
          found = true;
          updatePasswordHistory(inputPass.value, attemptCount);
        } else {
          setTimeout(() => tryPassword(passwordLength + 1), 10); // Adjust the delay (in milliseconds) to your preference
        }
      } else {
        if (!found) {
          setTimeout(() => tryPassword(useSameLength ? maxLength : 1), 10);
        }
      }
    }

    tryPassword(useSameLength ? maxLength : 1);
  }

  function generateRandomPassword(length, useSpecialChars) {
    const baseCharacters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const specialCharacters = "!@#$%^&*()_-+=<>?{}[]|/";
    const characters = useSpecialChars
      ? baseCharacters + specialCharacters
      : baseCharacters;
    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  }

  function updatePasswordHistory(password, attempts) {
    updatePasswordHistoryArray(password, attempts);
    updatePasswordHistoryTable(password, attempts);
    updateAttemptStats(attempts);
  }

  function updatePasswordHistoryArray(password, attempts) {
    passwordHistory.unshift({ password, attempts });
    if (passwordHistory.length > 3) {
      passwordHistory.pop();
    }
  }

  function updatePasswordHistoryTable(password, attempts) {
    let newRow = passwordHistoryTable.insertRow(0);
    newRow.insertCell(0).innerText = password;
    newRow.insertCell(1).innerText = attempts;

    if (passwordHistoryTable.rows.length > 3) {
      passwordHistoryTable.deleteRow(3);
    }
  }

  function updateAttemptStats(attempts) {
    numOfRuns++;
    totalAttempts += attempts;

    let longestAttempts = parseInt(longestAttemptsElement.innerText);
    let shortestAttempts = parseInt(shortestAttemptsElement.innerText);

    if (attempts > longestAttempts || longestAttempts === 0) {
      longestAttemptsElement.innerText = attempts;
    }

    if (attempts < shortestAttempts || shortestAttempts === 0) {
      shortestAttemptsElement.innerText = attempts;
    }

    averageAttemptsElement.innerText = (totalAttempts / numOfRuns).toFixed(2);
  }
}
