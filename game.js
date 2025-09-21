document.addEventListener('DOMContentLoaded', () =>async (params) => 
     {
})
    // Configuração do jogo
    const canvas = document.getElementById('maze-canvas');
    const ctx = canvas.getContext('2d');
    const rescueCounter = document.getElementById('rescue-counter');
    const victoryModal = document.getElementById('victory-modal');
    const restartBtn = document.querySelector('.restart-btn');
    
    // Dados do labirinto - MAIS COMPLEXO
    const mazeData = {
        width: 15,
        height: 15,
        start: {x: 1, y: 1},
        exit: {x: 13, y: 13},
        maze: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
            [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1,0,1,0,1],
            [1,0,1,1,1,1,1,0,1,0,1,0,1,0,1],
            [1,0,0,0,0,0,1,0,1,0,0,0,1,0,1],
            [1,1,1,1,1,0,1,0,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        patients: [
            {x: 5, y: 2},
            {x: 9, y: 5},
            {x: 3, y: 9},
            {x: 12, y: 11}
        ]
    };
    
    // Estado do jogo
    let gameState = {
        player: {...mazeData.start},
        rescuedPatients: [],
        rescuedCount: 0,
        exitReached: false
    };
    
    // Tamanho do tile
    const tileSize = 30;
    
    // Cores da UNIPAR
    const colors = {
        wall: '#2D2D2D',
        path: '#FFFFFF',
        player: '#E30613',
        patient: '#7C7C7C',
        exit: '#E30613',
        playerSymbol: '#FFFFFF',
        patientSymbol: '#FFFFFF'
    };
    
    // Carregar imagens
    const images = {
        psychologist: new Image(),
        patients: [
            new Image(),
            new Image(),
            new Image(),
            new Image()
        ]
    };
    
    // Carregar a imagem do psicólogo
    images.psychologist.src = './assets/psicologo.png';
    
    // Carregar as imagens dos pacientes
    images.patients[0].src = './assets/paciente 1.png';
    images.patients[1].src = './assets/paciente 2.png';
    images.patients[2].src = './assets/paciente 3.png';
    images.patients[3].src = './assets/paciente 4.png';
    
    // Inicializar o jogo
    function initGame() {
        gameState = {
            player: {...mazeData.start},
            rescuedPatients: [],
            rescuedCount: 0,
            exitReached: false
        };
        updateRescueCounter();
        drawMaze();
        victoryModal.classList.remove('active');
    }
    
    // Atualizar contador de resgates
    function updateRescueCounter() {
        rescueCounter.textContent = `${gameState.rescuedCount}/${mazeData.patients.length}`;
    }
    
    // Desenhar o labirinto
    function drawMaze() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar tiles
        for (let y = 0; y < mazeData.height; y++) {
            for (let x = 0; x < mazeData.width; x++) {
                const tileType = mazeData.maze[y][x];
                const xPos = x * tileSize;
                const yPos = y * tileSize;
                
                if (tileType === 1) { // Parede
                    drawWall(xPos, yPos);
                } else { // Caminho
                    drawPath(xPos, yPos);
                }
                
                // Desenhar saída
                if (tileType === 3) {
                    drawExit(xPos, yPos);
                }
            }
        }
        
        // Desenhar pacientes não resgatados
        mazeData.patients.forEach((patient, index) => {
            if (!gameState.rescuedPatients.includes(index)) {
                drawPatient(patient.x * tileSize, patient.y * tileSize, index);
            }
        });
        
        // Desenhar jogador
        drawPlayer(gameState.player.x * tileSize, gameState.player.y * tileSize);
    }
    
    // Desenhar parede
    function drawWall(x, y) {
        ctx.fillStyle = colors.wall;
        ctx.beginPath();
        ctx.roundRect(x, y, tileSize, tileSize, 3);
        ctx.fill();
        
        // Efeito de relevo
        ctx.strokeStyle = '#38434d';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.strokeStyle = '#252d34';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + tileSize, y);
        ctx.lineTo(x + tileSize, y + tileSize);
        ctx.stroke();
    }
    
    // Desenhar caminho
    function drawPath(x, y) {
        ctx.fillStyle = colors.path;
        ctx.beginPath();
        ctx.roundRect(x, y, tileSize, tileSize, 3);
        ctx.fill();
    }
    
    // Desenhar saída
    function drawExit(x, y) {
        drawPath(x, y);
        
        // Desenhar porta no estilo UNIPAR
        ctx.fillStyle = colors.exit;
        ctx.beginPath();
        ctx.roundRect(x + 5, y + 5, tileSize - 10, tileSize - 10, 5);
        ctx.fill();
        
        // Seta indicando saída
        ctx.fillStyle = colors.path;
        ctx.beginPath();
        ctx.moveTo(x + tileSize/2, y + 8);
        ctx.lineTo(x + tileSize - 8, y + tileSize - 8);
        ctx.lineTo(x + 8, y + tileSize - 8);
        ctx.closePath();
        ctx.fill();
    }
    
    // Desenhar paciente
    function drawPatient(x, y, index) {
        const img = images.patients[index];
        const size = tileSize * 0.8;
        const offset = (tileSize - size) / 2;
        
        if (img.complete && img.naturalHeight !== 0) {
            ctx.drawImage(img, x + offset, y + offset, size, size);
        } else {
            // Fallback caso a imagem não carregue
            ctx.fillStyle = colors.patient;
            ctx.beginPath();
            ctx.arc(x + tileSize/2, y + tileSize/2, tileSize/3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = colors.patientSymbol;
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('P', x + tileSize/2, y + tileSize/2);
        }
    }
    
    // Desenhar jogador
    function drawPlayer(x, y) {
        const img = images.psychologist;
        const size = tileSize * 0.8;
        const offset = (tileSize - size) / 2;
        
        if (img.complete && img.naturalHeight !== 0) {
            ctx.drawImage(img, x + offset, y + offset, size, size);
        } else {
            // Fallback caso a imagem não carregue
            ctx.fillStyle = colors.player;
            ctx.beginPath();
            ctx.arc(x + tileSize/2, y + tileSize/2, tileSize/3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = colors.playerSymbol;
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Ψ', x + tileSize/2, y + tileSize/2);
        }
    }
    
    // Mover jogador
    function movePlayer(dx, dy) {
        const newX = gameState.player.x + dx;
        const newY = gameState.player.y + dy;
        
        // Verificar se o movimento é válido
        if (newX >= 0 && newX < mazeData.width && 
            newY >= 0 && newY < mazeData.height && 
            mazeData.maze[newY][newX] !== 1) {
            
            gameState.player

            }}