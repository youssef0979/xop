let currentPlayer = 'X';
let nextBox = null; // يحدد المربع الكبير الذي يجب أن يلعب فيه اللاعب
let gameWon = false; // متغير للتحقق إذا انتهت اللعبة

// إعادة التشغيل
document.getElementById('reset-btn').addEventListener('click', resetGame);

// توليد المربعات الصغيرة داخل كل مربع كبير
document.querySelectorAll('.big-box').forEach((bigBox, bigIndex) => {
    for (let i = 0; i < 9; i++) {
        const smallBox = document.createElement('div');
        smallBox.dataset.index = i;
        smallBox.addEventListener('click', () => handleSmallBoxClick(smallBox, bigBox, bigIndex));
        bigBox.appendChild(smallBox);
    }
});

function handleSmallBoxClick(smallBox, bigBox, bigIndex) {
    if (gameWon) return; // توقف اللعبة إذا كان هناك فائز

    // تأكد من أن المربع الصغير فارغ والمربع الكبير هو الصحيح للعب أو أن المربع التالي غير محدد
    if (smallBox.textContent === '' && (nextBox === null || nextBox === bigIndex)) {
        smallBox.textContent = currentPlayer;

        // تحقق إذا كان اللاعب قد فاز بالمربع الكبير
        if (checkWin(bigBox)) {
            bigBox.innerHTML = `<div class="winner">${currentPlayer}</div>`;
            bigBox.classList.add('won');
        }

        // تحقق من فوز اللعبة بأكملها
        if (checkGameWin()) {
            displayWinMessage();
            setTimeout(resetGame, 10000); // إعادة تشغيل اللعبة بعد 10 ثوانٍ
            return;
        }

        // تغيير اللاعب
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        // تعيين المربع الكبير التالي الذي يجب اللعب فيه
        nextBox = parseInt(smallBox.dataset.index);

        // إذا كان المربع التالي قد فاز به أحد اللاعبين أو ممتلئ، يمكن اللعب في أي مربع فارغ
        if (document.querySelector(`#box-${nextBox}`).classList.contains('won') || isBigBoxFull(nextBox)) {
            nextBox = null; // السماح باللعب في أي مربع فارغ
        }
    }
}

// دالة للتحقق من الفوز في المربعات الكبيرة
function checkWin(bigBox) {
    const squares = Array.from(bigBox.children);
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // صفوف
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // أعمدة
        [0, 4, 8], [2, 4, 6]  // أقطار
    ];

    return winningCombinations.some(combination => {
        return combination.every(index => {
            return squares[index].textContent === currentPlayer;
        });
    });
}

// دالة للتحقق من فوز اللعبة بأكملها
function checkGameWin() {
    const bigBoxes = document.querySelectorAll('.big-box');
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // صفوف
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // أعمدة
        [0, 4, 8], [2, 4, 6]  // أقطار
    ];

    return winningCombinations.some(combination => {
        return combination.every(index => {
            return bigBoxes[index].classList.contains('won') && bigBoxes[index].querySelector('.winner').textContent === currentPlayer;
        });
    });
}

// دالة لإظهار رسالة الفوز
function displayWinMessage() {
    const winMessage = document.getElementById('win-message');
    const winText = document.getElementById('win-text');
    winText.textContent = `Player ${currentPlayer} Wins!`;
    winMessage.classList.remove('hidden');
    gameWon = true;
}

// دالة للتحقق إذا كان المربع الكبير ممتلئ بالكامل
function isBigBoxFull(bigIndex) {
    const bigBox = document.querySelector(`#box-${bigIndex}`);
    return Array.from(bigBox.children).every(smallBox => smallBox.textContent !== '');
}

// دالة إعادة التشغيل
function resetGame() {
    currentPlayer = 'X';
    nextBox = null;
    gameWon = false;
    document.querySelectorAll('.big-box').forEach(bigBox => {
        bigBox.innerHTML = '';
        bigBox.classList.remove('won');
        for (let i = 0; i < 9; i++) {
            const smallBox = document.createElement('div');
            smallBox.dataset.index = i;
            smallBox.addEventListener('click', () => handleSmallBoxClick(smallBox, bigBox, i));
            bigBox.appendChild(smallBox);
        }
    });
    document.getElementById('win-message').classList.add('hidden'); // إخفاء رسالة الفوز
}
