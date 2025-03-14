let perguntas = {};
let perguntasDisponiveis = [];
let perguntaAtual = null;
let categoriaAtual = null;
let respostasCorretas = 0;
let tempoRestante = 90; // 1:30
let contadorPerguntas = 0;
let timerInterval;
let recorde = localStorage.getItem("recordeQuiz") || 0;
recorde = parseInt(recorde);

document.getElementById("recorde").innerText = recorde;

function atualizarRecorde() {
    if (respostasCorretas > recorde) {
        recorde = respostasCorretas;
        
        localStorage.setItem("recordeQuiz", recorde);
        console.log(recorde)
        document.getElementById("recorde").innerText = recorde;
    }
}

let recordeAtual = 0;

document.getElementById("recordeAtual").innerText = recordeAtual;

function atualizarRecordeAtual() {
    recordeAtual = respostasCorretas;
    console.log(recordeAtual)
    document.getElementById("recordeAtual").innerText = recordeAtual;
}


async function carregarPerguntas() {
    const response = await fetch("perguntas.json");
    perguntas = await response.json();
    document.getElementById("telaInicial").style.display = "flex";
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
    tempoRestante = 90 - (Math.floor(contadorPerguntas / 5) * 10); // Diminui 10 segundos a cada 5 perguntas

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
    document.getElementById("telaInicial").style.display = "none";
    document.getElementById("telaQuiz").style.display = "none";
    document.getElementById("telaTempoEsgotado").style.display = "flex";
}

function carregarPergunta() {

    document.getElementById("telaQuiz").style.display = "flex";
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
    clearInterval(timerInterval); // Pausar o timer
    document.querySelectorAll("#opcoes li").forEach(li => li.onclick = null); // Desabilitar as outras respostas

    // Obtém o container correto do botão
    let container = elemento.parentElement;

    // Se a resposta for correta, adiciona a classe 'correta' à opção clicada
    if (indice === correta) {
        elemento.classList.add("correta");
        respostasCorretas++;
        document.getElementById("respostasCorretas").innerText = respostasCorretas;
        atualizarRecordeAtual()
        atualizarRecorde()
    } else {
        // Se a resposta for errada, adiciona a classe 'errada' à opção clicada
        elemento.classList.add("errada");
        atualizarRecordeAtual()
        atualizarRecorde()
    }

    // Adiciona a resposta correta à lista
    const opcoesEl = document.querySelectorAll("#opcoes li");
    const indiceCorreto = opcoes.findIndex(opcao => opcao.index === correta);

    // Destaca a opção correta (verde) se não for a mesma opção clicada
    opcoesEl[indiceCorreto].classList.add("correta");

    // Se o usuário acertou, vai para a próxima pergunta após 1 segundo
    if (indice === correta) {
        setTimeout(carregarPergunta, 1000);
    } else {
        setTimeout(mostrarExplicacao, 1500); // Se errar, mostra a explicação após 1,5 segundos
    }

    contadorPerguntas++;
}


function mostrarExplicacao() {
    document.getElementById("telaQuiz").style.display = "none";
    document.getElementById("telaExplicacao").style.display = "flex";

    document.getElementById("tema").innerText = categoriaAtual.toUpperCase();
    document.getElementById("descricaoTema").innerText = perguntas[categoriaAtual].descricao;
    document.getElementById("explicacao").innerText = perguntaAtual.explicacao;
}

function voltarParaTelaInicial() {
    document.getElementById("telaExplicacao").style.display = "none";
    document.getElementById("telaTempoEsgotado").style.display = "none";
    document.getElementById("telaInicial").style.display = "flex";
}

function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

carregarPerguntas();

const escritores = [
    {
        nome: "Machado De Assis",
        anos: "(1839-1908)",
        imagem: "src/machado.png",
        descricao: "Foi um dos maiores escritores brasileiros e um dos fundadores da Academia Brasileira de Letras. Considerado um mestre da literatura, introduziu o Realismo no Brasil com Memórias Póstumas de Brás Cubas (1881), rompendo com o Romantismo e trazendo uma narrativa inovadora, marcada pela ironia e pela análise psicológica dos personagens. Suas obras, como Dom Casmurro, Quincas Borba e Esaú e Jacó, exploram temas como hipocrisia, ambição e desigualdade social, oferecendo uma crítica profunda da sociedade brasileira de sua época. Seu legado influenciou gerações de escritores e consolidou a literatura brasileira no cenário mundial."
    },
    {
        nome: "Clarice Lispector",
        anos: "(1920-1977)",
        imagem: "src/clarice.png",
        descricao: "Foi uma das escritoras mais importantes do Brasil e uma das principais vozes da literatura modernista. Sua obra é marcada por uma escrita introspectiva, explorando temas como identidade, solidão e a complexidade do universo feminino. Romances como A Hora da Estrela, Perto do Coração Selvagem e A Paixão Segundo G.H. destacam seu estilo inovador e sua capacidade de mergulhar na psique dos personagens. Sua influência na literatura brasileira e mundial permanece forte até hoje."
    },
    {
        nome: "João Guimarães Rosa",
        anos: "(1908–1967)",
        imagem: "src/guimaraes.png",
        descricao: "Foi um dos maiores escritores brasileiros e inovador da literatura nacional. Sua obra-prima, Grande Sertão: Veredas, revolucionou a narrativa ao misturar regionalismo, neologismos e profundidade filosófica. Seus contos e romances, como Sagarana e Primeiras Estórias, exploram a cultura sertaneja, a luta humana e o destino. Seu estilo complexo e poético o tornou uma figura central do modernismo brasileiro e uma referência na literatura mundial."
    },
    {
        nome: "Carlos Drummond de Andrade",
        anos: "(1902–1987)",
        imagem: "src/drummond.png",
        descricao: "Um dos mais influentes poetas brasileiros do século XX, Drummond destacou-se por sua escrita reflexiva e inovadora. Sua poesia transitou entre o modernismo e uma abordagem mais universal da condição humana, explorando temas como amor, cotidiano, política e solidão. Obras como Sentimento do Mundo, A Rosa do Povo e Claro Enigma são marcos da literatura nacional. Sua influência é duradoura, consolidando-o como um dos maiores nomes da poesia em língua portuguesa."
    }
];

let index = 0;

function updateSlide() {
    document.getElementById("writer-name").textContent = escritores[index].nome;
    document.getElementById("writer-years").textContent = escritores[index].anos;
    document.getElementById("writer-img").src = escritores[index].imagem;
    document.getElementById("writer-description").textContent = escritores[index].descricao;
    
    document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}

function nextSlide() {
    index = (index + 1) % escritores.length;
    updateSlide();
}

function prevSlide() {
    index = (index - 1 + escritores.length) % escritores.length;
    updateSlide();
}

function goToSlide(slideIndex) {
    index = slideIndex;
    updateSlide();
    resetTimer();
}

// Troca automático a cada 5 segundos
function resetTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 50000);
}

// Inicia o timer quando a página carrega
slideInterval = setInterval(nextSlide, 50000);

function toggleSection() {
    const escritoresSection = document.getElementById("escritores");
    const creditosSection = document.getElementById("creditos");
    const documentationSection = document.getElementById("documentation");

    if (escritoresSection.style.display === "none") {
        escritoresSection.style.display = "flex";
        documentationSection.style.display = "none";
        creditosSection.style.display = "none";
    } else {
        escritoresSection.style.display = "none";
        documentationSection.style.display = "none";
        creditosSection.style.display = "flex";
    }
}

function toggleDocumentation() {
    const documentationSection = document.getElementById("documentation");
    const creditosSection = document.getElementById("creditos");
    const escritoresSection = document.getElementById("escritores");

    if (documentationSection.style.display === "none") {
        documentationSection.style.display = "flex"
        escritoresSection.style.display = "none";
        creditosSection.style.display = "none";
    } else {
        documentationSection.style.display = "none";
        creditosSection.style.display = "none";
        escritoresSection.style.display = "flex";   
    }
}

toggleDocumentation()