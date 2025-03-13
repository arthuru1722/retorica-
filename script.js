let perguntas = {};
let perguntasDisponiveis = [];
let perguntaAtual = null;
let categoriaAtual = null;
let respostasCorretas = 0;
let tempoRestante = 20; // 1:30
let contadorPerguntas = 0;
let timerInterval;

async function carregarPerguntas() {
    const response = await fetch("perguntas.json");
    perguntas = await response.json();
    document.getElementById("telaInicial").style.display = "block";
}

function iniciarQuiz() {
    document.getElementById("telaInicial").style.display = "none";
    perguntasDisponiveis = Object.keys(perguntas).flatMap(categoria =>
        perguntas[categoria].perguntas.map(pergunta => ({ ...pergunta, categoria }))
    );
    embaralharArray(perguntasDisponiveis);
    respostasCorretas = 0;
    contadorPerguntas = 0;
    document.getElementById("respostasCorretas").innerText = respostasCorretas;
    carregarPergunta();
    startTimer();
}

function startTimer() {  

    clearInterval(timerInterval); // Limpa qualquer timer anterior
    tempoRestante = 20 - (Math.floor(contadorPerguntas / 5) * 10); // Diminui 10 segundos a cada 5 perguntas

    if (tempoRestante < 10) tempoRestante = 10; // Limita o tempo para não ser menor que 10 segundos.

    document.getElementById("timer").innerText = formatTime(tempoRestante);

    // Verifica se a quantidade de perguntas respondidas é maior que 1
    if (contadorPerguntas > 1) {
        // Delay de 1 segundo para corrigir o bug de contagem, se já houver respostas anteriores
        setTimeout(function() {
            timerInterval = setInterval(updateTimer, 1000); // Começa o intervalo do timer após 1 segundo
        }, 1000);
    } else {
        // Caso contrário, começa o timer normalmente na primeira pergunta
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    tempoRestante--;
    document.getElementById("timer").innerText = formatTime(tempoRestante);

    // if (tempoRestante === 10) {
    //     document.getElementById("timer").style.color = "red";
    //     document.getElementById("timer").style.animation = "blinking 1  s infinite";
    // } else if (tempoRestante > 10 ) {
    //     document.getElementById("timer").style.color = "black";
    //     document.getElementById("timer").style.animation = ""; // Remove o efeito de piscar
    // }

    if (tempoRestante <= 0) {
        clearInterval(timerInterval);
        mostrarTempoEsgotado();
    }
}


function formatTime(seconds) {
    let minutos = Math.floor(seconds / 60);
    let segundos = seconds % 60;
    return `${minutos}:${segundos < 10 ? "0" + segundos : segundos}`;
}

function mostrarTempoEsgotado() {
    document.getElementById("telaQuiz").style.display = "none";
    document.getElementById("telaTempoEsgotado").style.display = "block";
}

function carregarPergunta() {

    document.getElementById("telaQuiz").style.display = "block";
    document.getElementById("telaExplicacao").style.display = "none";
    document.getElementById("telaTempoEsgotado").style.display = "none";

    if (perguntasDisponiveis.length === 0) {
        alert("Você respondeu todas as perguntas! O quiz será reiniciado.");
        iniciarQuiz();
        return;
    }

    perguntaAtual = perguntasDisponiveis.pop();
    categoriaAtual = perguntaAtual.categoria;

    document.getElementById("pergunta").innerText = perguntaAtual.pergunta;
    const opcoesEl = document.getElementById("opcoes");
    opcoesEl.innerHTML = ""; 

    // Criando um array de objetos {texto, índice} e embaralhando
    let opcoesEmbaralhadas = perguntaAtual.opcoes.map((opcao, index) => ({ texto: opcao, index }));
    embaralharArray(opcoesEmbaralhadas);

    opcoesEmbaralhadas.forEach(({ texto, index }) => {
        const li = document.createElement("li");
        li.innerText = texto;
        li.onclick = () => verificarResposta(li, index, perguntaAtual.correta, opcoesEmbaralhadas);
        opcoesEl.appendChild(li);
    });

    startTimer(); // Reinicia o timer aqui, quando a nova pergunta for carregada
}


function verificarResposta(elemento, indice, correta, opcoes) {
    document.querySelectorAll("#opcoes li").forEach(li => li.onclick = null);

    // Encontra qual índice embaralhado é o da resposta correta
    const indiceCorreto = opcoes.findIndex(opcao => opcao.index === correta);

    document.querySelectorAll("#opcoes li")[indiceCorreto].classList.add("correta"); // Destaca a correta

    if (indice === correta) {
        elemento.innerHTML += " ✔️";
        respostasCorretas++;
        document.getElementById("respostasCorretas").innerText = respostasCorretas;
        setTimeout(carregarPergunta, 1000); // Se acertar, vai pra próxima pergunta
    } else {
        elemento.innerHTML += " ❌";
        elemento.classList.add("errada");
        setTimeout(mostrarExplicacao, 1500); // Se errar, mostra explicação
    }

    contadorPerguntas++;
}

function mostrarExplicacao() {
    document.getElementById("telaQuiz").style.display = "none";
    document.getElementById("telaExplicacao").style.display = "block";

    document.getElementById("tema").innerText = categoriaAtual.toUpperCase();
    document.getElementById("descricaoTema").innerText = perguntas[categoriaAtual].descricao;
    document.getElementById("explicacao").innerText = perguntaAtual.explicacao;
}

function voltarParaTelaInicial() {
    document.getElementById("telaExplicacao").style.display = "none";
    document.getElementById("telaTempoEsgotado").style.display = "none";
    document.getElementById("telaInicial").style.display = "block";
}

function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

carregarPerguntas();