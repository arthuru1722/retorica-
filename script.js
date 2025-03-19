document.getElementById('telaInicial').style.display = "flex"


let perguntas = {};
let perguntasD = {};
let perguntasM = {};
let perguntasDisponiveis = [];
let perguntaAtual = null;
let categoriaAtual = null;
let respostasCorretas = 0;
let tempoRestante = 60; // 1:30
let contadorPerguntas = 0;
let count = 3;
let timerInterval;
let recorde = localStorage.getItem("recordeQuiz") || 0;
let respostas = localStorage.getItem("Respostas") || 0;
let respostasW = localStorage.getItem("respostasW") || 0; // Corrigido
let respostasR = localStorage.getItem("respostasR") || 0; // Corrigido
let timee = localStorage.getItem("timee") || 0;
let esgotado = localStorage.getItem("esgotado") || 0;

recorde = parseInt(recorde);
respostas = parseInt(respostas);
respostasW = parseInt(respostasW);
respostasR = parseInt(respostasR);
timee = parseInt(timee);
esgotado = parseInt(esgotado);


document.getElementById("recordee").innerText = recorde;
document.getElementById("recorde").innerText = recorde;
atualizarRecorde()
document.getElementById("respostas").innerText = respostas;
document.getElementById("respostasW").innerText = respostasW;
document.getElementById("respostasR").innerText = respostasR;
document.getElementById("esgotado").innerText = esgotado;

let sessenta = false;
let cinquenta = false;
let quarenta = false;
let trinta = false;
let vinte = false;
let quinze = false;

function formatarTempo(timee) {
    let minutos = Math.floor(timee / 60);
    let horas = Math.floor(timee / 3600);
    let dias = Math.floor(timee / 86400);
    
    if (timee < 60) {
        return `${timee} segundos`;
    } else if (timee < 3600) {
        return `${minutos} minutos`;
    } else if (timee > 3600 && timee < 7200) {
        return `${horas} hora`;
    } else if (timee < 86400) {
        return `${horas} horas`;
    } else {
        return `${dias} dias e ${horas % 24} horas`;
    }
}

document.getElementById("timee").textContent = formatarTempo(timee);


function atualizarRecorde() {
    if (respostasCorretas > recorde) {
        recorde = respostasCorretas;
        
        localStorage.setItem("recordeQuiz", recorde);
        document.getElementById("recorde").innerText = recorde;
    }
}

let recordeAtual = 0;

document.getElementById("recordeAtual").innerText = recordeAtual;

function atualizarRecordeAtual() {
    recordeAtual = respostasCorretas;
    document.getElementById("recordeAtual").innerText = recordeAtual;
}

async function json1() {
    const telaInicial = document.getElementById('telaInicial');

    response1 = await fetch("perguntas.json");
    perguntas = await response1.json();

    console.log(perguntas);
    
    if (telaInicial.style.display === 'flex') {
        iniciarQuiz()
    } 
    
}

async function json2() {
    const telaInicial = document.getElementById('telaInicial');

    response1 = await fetch("perguntasM.json");
    perguntas = await response1.json();

    console.log(perguntas);
    
        
    setTimeout(() => {
        if (telaInicial.style.display === 'flex') {
            iniciarQuiz()
        } 
    }, 500); 
        
    
    
}

async function json3() {
    const telaInicial = document.getElementById('telaInicial');

    response1 = await fetch("perguntasD.json"); 
    perguntas = await response1.json();

    console.log(perguntas);
    
    setTimeout(() => {
        if (telaInicial.style.display === 'flex') {
            iniciarQuiz()
        } 
    }, 500);  
    
    
}

async function json4() {
    const telaInicial = document.getElementById('telaInicial');

    // Lista os nomes dos arquivos como strings
    const arquivos = ["perguntas.json", "perguntasM.json", "perguntasD.json"];

    // Limpa o objeto perguntas para evitar acumulação
    perguntas = {};

    for (const arquivo of arquivos) {
        const dados = await fetch(arquivo).then(res => res.json());
        // Mescla as categorias de cada arquivo
        for (const categoria in dados) {
            if (!perguntas[categoria]) {
                perguntas[categoria] = { descricao: dados[categoria].descricao, perguntas: [] };
            }
            perguntas[categoria].perguntas.push(...dados[categoria].perguntas);
        }
    }

    console.log("Perguntas mescladas:", perguntas);

    setTimeout(() => {
        if (telaInicial.style.display === 'flex') {
            iniciarQuiz();
        } 
    }, 500);
}

  


function iniciarQuizBtn() {
    if (respostasR <= 40) {
        json1()
        console.log('respostasR <= 40')
    } else if (respostasR >= 40 && respostasR < 80) {
        json2()
        console.log('respostasR >= 40')
    } else if (respostasR >= 80 && respostasR < 120) {
        json3()
        console.log('respostasR >= 80')
    } else if (respostasR >= 120) {
        toggleSelect()
        console.log('respostasR >= 120')
    }
}

function toggleSelect() {
    const creditos = document.getElementById('creditos');
    const select = document.getElementById('select');
    const escritores = document.getElementById('escritores');

    if (select.style.display === "none") {
        select.style.display = "flex";
        creditos.style.display = "none";
        escritores.style.display = "none";
    } else {
        select.style.display = "none";
        creditos.style.display = "none";
        escritores.style.display = "flex";
    }
}

toggleSelect()

function iniciarQuiz() {
    vidaAtual = 3;
    atualizarVidas()
    sessenta = false;
    cinquenta = false;
    quarenta = false;
    trinta = false;
    vinte = false;
    quinze = false;

    const vinheta = document.querySelector(".vinheta");
    vinheta.classList.add("ativa");
    setTimeout(() => {
        animateTimer()
    }, 1000);
    

    // Remove a vinheta após a animação pra não ficar ocupando espaço na DOM
    setTimeout(() => {
        vinheta.classList.remove("ativa");
    }, 5000);
    setTimeout(() => {
        document.getElementById("telaInicial").style.display = "none";
        document.getElementById("telaExplicacao").style.display = "none";
        document.getElementById("telaTempoEsgotado").style.display = "none";
        perguntasDisponiveis = Object.keys(perguntas).flatMap(categoria =>
            perguntas[categoria].perguntas.map(pergunta => ({ ...pergunta, categoria }))
        );
        embaralharArray(perguntasDisponiveis);
        respostasCorretas = 0;
        contadorPerguntas = 0;
        document.getElementById("respostasCorretas").innerText = respostasCorretas;
        carregarPergunta();
    }, 4000);
    startTimer();

}

function startTimer() {  

    clearInterval(timerInterval); // Limpa qualquer timer anterior
    tempoRestante = 60 - (Math.floor(contadorPerguntas / 5) * 10); // Diminui 10 segundos a cada 5 perguntas
    if (tempoRestante < 15) tempoRestante = 15; // Limita o tempo para não ser menor que 10 segundos.
    document.getElementById("timer").innerText = formatTime(tempoRestante);
    if (tempoRestante > 10 ) {
        document.getElementById("timer").style.color = "#7e493e";
        document.getElementById("timer").style.animation = ""; // Remove o efeito de piscar
    }

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

// Criar o elemento de áudio

function updateTimer() {
    tempoRestante--;
    timee++;
    localStorage.setItem("timee", timee);
    document.getElementById("timer").innerText = formatTime(tempoRestante);

     if (tempoRestante === 10) {
         document.getElementById("timer").style.color = "red";
         document.getElementById("timer").style.animation = "blinking 1s infinite";
     } else if (tempoRestante > 10 ) {
         document.getElementById("timer").style.color = "#7e493e";
         document.getElementById("timer").style.animation = ""; // Remove o efeito de piscar
     }

    if (tempoRestante <= 0) {
        esgotado++;
        localStorage.setItem("esgotado", esgotado);
        clearInterval(timerInterval);
        mostrarTempoEsgotado();
    }
}
const vinheta1 = document.querySelector(".vinheta1");
function vinheta2() {
        vinheta1.classList.add("ativa1");
        // Remove a vinheta1 após a animação pra não ficar ocupando espaço na DOM
        setTimeout(() => {
            vinheta1.classList.remove("ativa1");
        }, 2000);
}

const vinheta3 = document.querySelector(".vinheta2");
function vinheta4() {
        vinheta3.classList.add("ativa2");
        // Remove a vinheta1 após a animação pra não ficar ocupando espaço na DOM
        setTimeout(() => {
            vinheta3.classList.remove("ativa2");
        }, 2000);
}

function formatTime(seconds) {
    let minutos = Math.floor(seconds / 60);
    let segundos = seconds % 60;
    return `${minutos}:${segundos < 10 ? "0" + segundos : segundos}`;
}

function mostrarTempoEsgotado() {
    vinheta4()
    setTimeout(() => {
        document.getElementById("telaInicial").style.display = "none";
        document.getElementById("telaQuiz").style.display = "none";
        document.getElementById("telaTempoEsgotado").style.display = "flex";
    }, 1000);
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
    const reduT = document.getElementById('reduT')
    const notitop = document.getElementById('noti-top')
    if (tempoRestante === 60 && !sessenta) {
        notitop.innerHTML = "Tempo restante:"
        reduT.innerHTML = "60"
        notification()
        sessenta = true;
    } else if (tempoRestante === 50 && !cinquenta) {
        notitop.innerHTML = "Tempo reduzido para:"
        reduT.innerHTML = "50"
        notification()
        cinquenta = true;
    } else if (tempoRestante === 40 && !quarenta) {
        reduT.innerHTML = "40"
        notification()
        quarenta = true;
    } else if (tempoRestante === 30 && !trinta) {
        reduT.innerHTML = "30"
        notification()
        trinta = true;
    } else if (tempoRestante === 20 && !vinte) {
        reduT.innerHTML = "20"
        notification()
        vinte = true;
    } else if (tempoRestante === 15 && !quinze) {
        reduT.innerHTML = "15"
        notification()
        quinze = true;
    }

}

function notification() {
    const notificacao = document.getElementById('notificacao');
    
    // Exibindo a notificação deslizando para baixo
    notificacao.style.display = 'flex';
    setTimeout(() => {
        notificacao.classList.add('visivel'); // Adiciona a classe para animar a posição
    }, 10); // Espera o display ser alterado antes de animar

    // Escondendo a notificação após 3 segundos
    setTimeout(() => {
        notificacao.classList.remove('visivel'); // Remove a classe para fazer ela sair
    }, 3000); // Dura 3 segundos

    // Escondendo a notificação completamente após a animação
    setTimeout(() => {
        notificacao.style.display = 'none';
    }, 3500); // Tempo total após a animação
}


function verificarResposta(elemento, indice, correta, opcoes) {
    respostas += 1;
    localStorage.setItem("Respostas", respostas);
    clearInterval(timerInterval); // Pausar o timer
    document.querySelectorAll("#opcoes li").forEach(li => li.onclick = null); // Desabilitar as outras respostas

    // Se a resposta for correta, adiciona a classe 'correta' à opção clicada
    if (indice === correta) {
        respostasR++;
        localStorage.setItem("respostasR", respostasR);
        elemento.classList.add("correta");
        respostasCorretas++;
        document.getElementById("respostasCorretas").innerText = respostasCorretas;
        atualizarRecordeAtual();
        atualizarRecorde();
    } else {
        respostasW++;
        localStorage.setItem("respostasW", respostasW);
        // Se a resposta for errada, adiciona a classe 'errada' à opção clicada
        elemento.classList.add("errada");
        atualizarRecordeAtual();
        perderVida();
        atualizarRecorde();
    }

    // Adiciona a resposta correta à lista
    const opcoesEl = document.querySelectorAll("#opcoes li");
    const indiceCorreto = opcoes.findIndex(opcao => opcao.index === correta);

    // Destaca a opção correta (verde) se não for a mesma opção clicada
    opcoesEl[indiceCorreto].classList.add("correta");

    // Se o usuário acertou, vai para a próxima pergunta após 1 segundo
    if (indice === correta) {
        setTimeout(carregarPergunta, 1000);
    } else if (vidaAtual >= 2) {
        setTimeout(carregarPergunta, 1000);
        // Se errar, mostra a explicação após 1,5 segundos
    }

    contadorPerguntas++;
}


function mostrarExplicacao() {
    vinheta2() 
    setTimeout(() => {
        document.getElementById("telaQuiz").style.display = "none";
        document.getElementById("telaExplicacao").style.display = "flex";
        document.getElementById("tema").innerText = categoriaAtual.toUpperCase();
        document.getElementById("descricaoTema").innerText = perguntas[categoriaAtual].descricao;
        document.getElementById("explicacao").innerText = perguntaAtual.explicacao;
    }, 500);
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
    const creditosbtn = document.getElementById("creditosbtn");

    if (escritoresSection.style.display === "none") {
        creditosbtn.innerHTML = "Creditos";
        escritoresSection.style.display = "flex";
        creditosSection.style.display = "none";
    } else {
        creditosbtn.innerHTML = "Escritores";
        escritoresSection.style.display = "none";
        creditosSection.style.display = "flex";
    }
}

const timerElement = document.getElementById("timerr");

function showStats() {
    const estatistica = document.getElementById("estatisticas")

    if (estatistica.style.display === "none") {
        estatistica.style.display = "flex";
    } else {
        estatistica.style.display = "none";
    }
}
function ocultStats() {
    const estatistica = document.getElementById("estatisticas");
    estatistica.style.display = "none";
}

showStats()

function animateTimer() {
    if (count > 0) {
        timerElement.textContent = count;
        
        // Primeiro aumenta, depois diminui
        timerElement.style.transform = `scale(${1.5})`;

        setTimeout(() => {
            timerElement.style.transform = `scale(${1.2})`; // Ainda maior que o original
        }, 300);

        count--;
        setTimeout(animateTimer, 1000);
    } else {
        // Substitui o número pelo ícone com a animação de escala
        timerElement.innerHTML = '<i class="fa-solid fa-check"></i>';
        const checkIcon = document.querySelector('.fa-check');
        
        // Anima o ícone de check
        checkIcon.style.transform = `scale(${1.2})`;

        setTimeout(() => {
            checkIcon.style.transform = `scale(${1.5})`; // Deixa ele um pouco maior que o original
        },1);

        setTimeout(() => {
            checkIcon.style.transform = `scale(${1.2})`; // Deixa ele um pouco maior que o original
        }, 301);
        setTimeout(() => {
            timerElement.innerHTML = '3';
            count = 3;
        }, 1999);
        
    }
}

atualizarRecorde()

let vidaAtual = 3;
const vidaMaxima = 6;

function ganharVida() {
    if (vidaAtual < vidaMaxima) {
        vidaAtual++;
        atualizarVidas();
    }
}

function perderVida() {
    setTimeout(() => {
        if (vidaAtual > 0) {
            vidaAtual--;
            atualizarVidas();
        }
    }, 1500);
    
}

function atualizarVidas() {
    const vidasContainer = document.getElementById("vidas");
    vidasContainer.innerHTML = "";

    if (vidaAtual > 0) {
        for (let i = 0; i < vidaAtual; i++) {
            vidasContainer.innerHTML += `<i class="fa-solid fa-heart"></i> `;
        }
    } else {
        mostrarExplicacao();
    }
}



function difficultyToggle() {
    const difficulty = document.getElementById('difficulty');
    const difficultyBtn = document.getElementById('difficultyBtn');

    if (difficulty.style.display === "none") {
        difficulty.style.display = "grid";
        difficultyBtn.style.backgroundColor = "#4f6d5c";
    } else {
        difficulty.style.display = "none";
        difficultyBtn.style.backgroundColor = "";
    }
}

difficultyToggle()


function cu() {
    if (respostasCorretas < 1) {
        json1();
    } else if (respostasCorretas >= 2 && respostasCorretas < 3) {
        json2();
    } else if (respostasCorretas > 3) {
        json2();
    }
}

//

function gradualPlay() {
    // Carrega o JSON inicial
    json1(); 

    // Monitora a mudança de respostas corretas dinamicamente
    const originalCarregarPergunta = carregarPergunta;
    carregarPergunta = function() {
        // Verifica o progresso antes de cada nova pergunta
        if (respostasCorretas >= 2 && respostasCorretas < 5) {
            json2(); // Médio
        } else if (respostasCorretas >= 5) {
            json3(); // Difícil
        }
        originalCarregarPergunta(); // Chama a função original
    };
}


function easePlay() {
    const vinheta = document.getElementById('vinheta');
    vinheta.style.background = "#6e8f7c";
    json1();
}

function mediumPlay() {
    const vinheta = document.getElementById('vinheta');
    vinheta.style.background = "#f4bb8c";
    json2();
}

function hardPlay() {
    const vinheta = document.getElementById('vinheta');
    vinheta.style.background = "#CF1E1E";
    json3();
}

function randomPlay() {
    json4();
}