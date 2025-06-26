let currentPlayer = 'X';
let gameBoard = Array(9).fill('');
let gameActive = true;
let bgMusicEnabled = true;

        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        // Sound objects
        const WinSound = new Audio("Win.wav");
        const TieSound = new Audio("Draw.wav");
        const ResetSound = new Audio("reset.wav");
        const CircleSound = new Audio("circle.wav");
        const CrossSound = new Audio("crossmark.wav");
        const BGSound = new Audio("bg sound.wav");
        const TickSound = new Audio("Tick.mp3");

        // Configure background music
        BGSound.loop = true;
        BGSound.volume = 1;

        // Cookie functions
        function setCookie(name, value, days) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        }

        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        // Play sound function
        function playSound(sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play failed:', e));
        }

        // Sound control functions
        function toggleBGMusic() {
            bgMusicEnabled = !bgMusicEnabled;
            const soundIcon = document.getElementById('soundIcon');
            if (bgMusicEnabled) {
                BGSound.play().catch(e => console.log('BG music play failed:', e));
                soundIcon.src = 'sound-volume.svg';
            } else {
                BGSound.pause();
                soundIcon.src = 'sound-off.svg';
            }
        }

        // Load win counts from cookies
        function loadWinCounts() {
            const xWins = getCookie('xWins') || '0';
            const oWins = getCookie('oWins') || '0';
            document.getElementById('xWins').textContent = xWins;
            document.getElementById('oWins').textContent = oWins;
        }

        // Save win counts to cookies
        function saveWinCounts() {
            const xWins = document.getElementById('xWins').textContent;
            const oWins = document.getElementById('oWins').textContent;
            setCookie('xWins', xWins, 365);
            setCookie('oWins', oWins, 365);
        }

        // Update win count
        function updateWinCount(player) {
            const winElement = document.getElementById(player.toLowerCase() + 'Wins');
            const currentWins = parseInt(winElement.textContent);
            winElement.textContent = currentWins + 1;
            saveWinCounts();
        }

        // Initialize particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 8 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
                
                // Random colors
                const colors = ['#ff0080', '#00ff80', '#0080ff', '#ff8000'];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.boxShadow = `0 0 6px ${particle.style.background}`;
                
                particlesContainer.appendChild(particle);
            }
        }

        // Create strike-through line
        function createStrikeLine(condition) {
            const board = document.getElementById('board');
            const cells = document.querySelectorAll('.cell');
            const [a, b, c] = condition;
            
            const cellA = cells[a].getBoundingClientRect();
            const cellC = cells[c].getBoundingClientRect();
            const boardRect = board.getBoundingClientRect();
            
            const line = document.createElement('div');
            line.className = 'strike-line';
            
            // Calculate position and dimensions
            const startX = cellA.left + cellA.width / 2 - boardRect.left;
            const startY = cellA.top + cellA.height / 2 - boardRect.top;
            const endX = cellC.left + cellC.width / 2 - boardRect.left;
            const endY = cellC.top + cellC.height / 2 - boardRect.top;
            
            const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
            
            line.style.left = startX + 'px';
            line.style.top = (startY - 3) + 'px';
            line.style.width = length + 'px';
            line.style.transform = `rotate(${angle}deg)`;
            
            board.appendChild(line);
            
            // Play tick sound
            playSound(TickSound);
        }

        // Handle cell click
        function handleCellClick(e) {
            const cell = e.target;
            const cellIndex = parseInt(cell.getAttribute('data-cell'));

            if (gameBoard[cellIndex] !== '' || !gameActive) return;

            gameBoard[cellIndex] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer.toLowerCase());

            // Play move sound
            if (currentPlayer === 'X') {
                playSound(CrossSound);
            } else {
                playSound(CircleSound);
            }

            const winningCondition = checkWinner();
            if (winningCondition) {
                document.getElementById('currentPlayer').textContent = `Player ${currentPlayer} Wins! 🎉`;
                gameActive = false;
                highlightWinningCells(winningCondition);
                createStrikeLine(winningCondition);
                updateWinCount(currentPlayer);
                setTimeout(() => playSound(WinSound), 500);
                return;
            }

            if (gameBoard.every(cell => cell !== '')) {
                document.getElementById('currentPlayer').textContent = "It's a Draw! 🤝";
                gameActive = false;
                playSound(TieSound);
                return;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('currentPlayer').textContent = `Current Player: ${currentPlayer}`;
        }

        function checkWinner() {
            for (let condition of winningConditions) {
                const [a, b, c] = condition;
                if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                    return condition;
                }
            }
            return null;
        }

        function highlightWinningCells(condition) {
            const cells = document.querySelectorAll('.cell');
            condition.forEach(index => {
                cells[index].classList.add('winning-cell');
            });
        }

        function resetGame() {
            currentPlayer = 'X';
            gameBoard = Array(9).fill('');
            gameActive = true;
            document.getElementById('currentPlayer').textContent = 'Current Player: X';
            
            // Remove strike lines
            document.querySelectorAll('.strike-line').forEach(line => line.remove());
            
            document.querySelectorAll('.cell').forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('x', 'o', 'winning-cell');
            });

            playSound(ResetSound);
        }

        // Add event listeners
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });

        // Initialize game
        createParticles();
        loadWinCounts();
        
        // Start background music after user interaction
        document.addEventListener('click', function startMusic() {
            if (bgMusicEnabled) {
                BGSound.play().catch(e => console.log('BG music play failed:', e));
            }
            document.removeEventListener('click', startMusic);
        }, { once: true });