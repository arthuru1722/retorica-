document.getElementById('telaInicial').style.display = "flex"


let perguntas = {};
let vel = 1000; // 1 segundo do timer padrão, so pra poder mudar com mais facilidade essa desgraça
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

let bonusAtivo = false;
let efeitosAtivos = [];
let blurr = false;

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
    const response = await fetch("perguntas.json");
    perguntas = await response.json();
    console.log("Carregado: perguntas.json", perguntas);
}

async function json2() {
    const response = await fetch("perguntasM.json");
    perguntas = await response.json();
    console.log("Carregado: perguntasM.json", perguntas);
}

async function json3() {
    const response = await fetch("perguntasD.json");
    perguntas = await response.json();
    console.log("Carregado: perguntasD.json", perguntas);
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
        iniciarQuiz()
        console.log('respostasR <= 40')
    } else if (respostasR >= 40 && respostasR < 80) {
        json2()
        iniciarQuiz()
        console.log('respostasR >= 40')
    } else if (respostasR >= 80 && respostasR < 120) {
        json3()
        iniciarQuiz()
        console.log('respostasR >= 80')
    } else if (respostasR >= 120) {
        selectShow()
        console.log('respostasR >= 120')
    }
}


function iniciarQuiz() {
    const vida = document.getElementById('vidas');
    const timer = document.getElementById('timerContainer');
    vida.style.filter = "none";
    timer.style.filter = "none";
    blurr = false;
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
    setTimeout(() => {
        select.classList.remove("ativa1");
    }, 2000);
    
    

    // Remove a vinheta após a animação pra não ficar ocupando espaço na DOM
    setTimeout(() => {
        vinheta.classList.remove("ativa");
    }, 5000);
    setTimeout(() => {
        document.getElementById("telaInicial").style.display = "none";
        document.getElementById("telaExplicacao").style.display = "none";
        document.getElementById("telaTempoEsgotado").style.display = "none";
        
        reiniciarPerguntasDisponiveis();

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
    tempoRestante = 60 - (Math.floor(contadorPerguntas / 10) * 10); // Diminui 10 segundos a cada 5 perguntas
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
            timerInterval = setInterval(updateTimer, vel); // Começa o intervalo do timer após 1 segundo
        }, 1000);
    } else {
        // Caso contrário, começa o timer normalmente na primeira pergunta
        timerInterval = setInterval(updateTimer, vel);
    }
}

// Criar o elemento de áudio

function updateTimer() {
    const telaQuiz = document.getElementById("telaQuiz");
    if (telaQuiz.style.display === "flex") {
        tempoRestante--;
        timee++;
        localStorage.setItem("timee", timee);
        document.getElementById("timer").innerText = formatTime(tempoRestante);

        if (tempoRestante <= 10 && tempoRestante > 5) {
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
    
}
const vinheta1 = document.querySelector(".vinheta1");
function vinheta2() {
        vinheta1.classList.add("ativa1");
        // Remove a vinheta1 após a animação pra não ficar ocupando espaço na DOM
        setTimeout(() => {
            vinheta1.classList.remove("ativa1");
        }, 3000);
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
        full.style.display = "none";
        document.getElementById("telaInicial").style.display = "none";
        document.getElementById("telaQuiz").style.display = "none";
        document.getElementById("telaTempoEsgotado").style.display = "flex";
        bonusEl.remove();
    }, 800);
}

function carregarPergunta() {

    bonusEl.remove();
    console.log ('remove carregarpergunta')

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

    setTimeout(() => {
        mostrarBonus();
        console.log('mostrarbonus carregarpergunta')
    }, 1000);
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
    clearTimeout(mostrarBonus);
    localStorage.setItem("Respostas", respostas);
    clearInterval(timerInterval); // Pausar o timer
    document.querySelectorAll("#opcoes li").forEach(li => li.onclick = null); // Desabilitar as outras respostas

    // Se a resposta for correta, adiciona a classe 'correta' à opção clicada
    if (indice === correta) {
        respostasR++;
        localStorage.setItem("respostasR", respostasR);
        if (!blurr) {
            elemento.classList.add("correta");
        }
        respostasCorretas++;
        document.getElementById("respostasCorretas").innerText = respostasCorretas;
        atualizarRecordeAtual();
        atualizarRecorde();
    } else {
        respostasW++;
        localStorage.setItem("respostasW", respostasW);
        // Se a resposta for errada, adiciona a classe 'errada' à opção clicada
        if (!blurr) {
            elemento.classList.add("errada");
        }
        
        atualizarRecordeAtual();
        perderVida();
        atualizarRecorde();
    }

    // Adiciona a resposta correta à lista
    const opcoesEl = document.querySelectorAll("#opcoes li");
    const indiceCorreto = opcoes.findIndex(opcao => opcao.index === correta);

    // Destaca a opção correta (verde) se não for a mesma opção clicada
    if (!blurr) {
        opcoesEl[indiceCorreto].classList.add("correta");  
    }
    

    // Se o usuário acertou, vai para a próxima pergunta após 1 segundo
    if (indice === correta) {
        setTimeout(carregarPergunta, 1000);
    } else if (vidaAtual >= 2) {
        setTimeout(carregarPergunta, 1000);
        // Se errar, mostra a explicação após 1,5 segundos
    }

    contadorPerguntas++;

    // Verificar eventos a cada 10 acertos
    if (respostasCorretas % 10 === 0 && respostasCorretas > 0) {
        triggerEvento();
        console.log('event trigger')
    }

    bonusEl.remove()
    
}


function mostrarExplicacao() {
    vinheta2() 
    setTimeout(() => {
        full.style.display = "none";
        document.getElementById("telaQuiz").style.display = "none";
        document.getElementById("telaExplicacao").style.display = "flex";
        document.getElementById("tema").innerText = categoriaAtual.toUpperCase();
        document.getElementById("descricaoTema").innerText = perguntas[categoriaAtual].descricao;
        document.getElementById("explicacao").innerText = perguntaAtual.explicacao;
        bonusEl.remove();
    }, 500);
}

function voltarParaTelaInicial() {
    full.style.display = "none";
    document.getElementById("telaExplicacao").style.display = "none";
    document.getElementById("telaTempoEsgotado").style.display = "none";
    document.getElementById("telaInicial").style.display = "flex";
    bonusEl.remove();
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
    }, 100);
    
}

function atualizarVidas() {
    const vidasContainer = document.getElementById("vidas");
    vidasContainer.innerHTML = "";

    if (vidaAtual > 0) {
        for (let i = 0; i < vidaAtual; i++) {
            vidasContainer.innerHTML += `<i class="fa-solid fa-heart"></i> `;
        }
    } else {
        setTimeout(() => {
            mostrarExplicacao();
        }, 1000);
        
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


//

function gradualPlay() {
    json1().then(() => {
        iniciarQuiz();
    });

    const originalVerificarResposta = verificarResposta;
    verificarResposta = function(...args) {
        originalVerificarResposta.apply(this, args);

        setTimeout(() => {
            if (respostasCorretas === 2) {
                console.log("Mudando para perguntas MÉDIAS");
                json2().then(() => reiniciarPerguntasDisponiveis());
            } else if (respostasCorretas === 5) {
                console.log("Mudando para perguntas DIFÍCEIS");
                json3().then(() => reiniciarPerguntasDisponiveis());
            }
        }, 1000);
    };
}

function reiniciarPerguntasDisponiveis() {
    perguntasDisponiveis = Object.keys(perguntas).flatMap(categoria =>
        perguntas[categoria].perguntas.map(pergunta => ({ ...pergunta, categoria }))
    );
    embaralharArray(perguntasDisponiveis);
    console.log("Perguntas reiniciadas. Total:", perguntasDisponiveis.length);
}


function easePlay() {
    const vinheta = document.getElementById('vinheta');
    vinheta.style.background = "#6e8f7c";
    json1().then(() => {
        iniciarQuiz(); // Inicia o quiz após carregar o JSON
    });
}

function mediumPlay() {
    const vinheta = document.getElementById('vinheta');
    vinheta.style.background = "#f4bb8c";
    json2().then(() => {
        iniciarQuiz(); // Inicia o quiz após carregar o JSON
    });
}

function hardPlay() {
    const vinheta = document.getElementById('vinheta');
    vinheta.style.background = "#CF1E1E";
    json3().then(() => {
        iniciarQuiz(); // Inicia o quiz após carregar o JSON
    });
}

function randomPlay() {
    json4();
}

const select = document.querySelector(".select");
function selectShow() {
    select.classList.add("ativa1");
    // Remove a vinheta1 após a animação pra não ficar ocupando espaço na DOM
    // setTimeout(() => {
    //     select.classList.remove("ativa1");
    // }, 2000);
}

function ocultSelf() {
    const sele = document.getElementById("sele");
    const select = document.getElementById("select");

    document.addEventListener("click", (event) => {
        if (event.target !== sele && event.target == select) {
            select.classList.remove("ativa1");
        }
    });
    
        
    
    
}
let bonusTimeout;
const bonusEl = document.createElement('div');
// Novo elemento HTML (adicionar no CSS o estilo)
function mostrarBonus() {
    clearTimeout(bonusTimeout);
    
    bonusEl.id = 'bonus-notificacao';
    bonusEl.innerHTML = `
        🎁 Bônus Disponível!
        <div class="opcoes-bonus">
            <button onclick="escolherBonus(true)">Pegar</button>
            <button onclick="escolherBonus(false)">Recusar</button>
        </div>
    `;
    document.body.appendChild(bonusEl);
    bonusTimeout = setTimeout(() => {bonusEl.remove(); console.log('bonus remove MostrarBonus')}, 15000);
}
const full = document.getElementById('full');
// Efeitos dos bônus
const efeitosBonus = [
    {
        tipo: 'tempo',
        valor: 2,
        desc: 'Tempo Dobrado!',
        chance: 0.1,
        aplicar: () => tempoRestante *= 2
    },
    {
        tipo: 'tempo',
        valor: 1,
        desc: 'Tempo congelado! (30 segundos)',
        chance: 0.1,
        aplicar: () => {
            clearInterval(timerInterval);
            setTimeout(() => {
                timerInterval = setInterval(updateTimer, 1000);
            }, 30000);
        }
    },
    {
        tipo: 'tempo',
        valor: 0.5,
        desc: 'Tempo Reduzido!',
        chance: 0.1,
        aplicar: () => tempoRestante = Math.floor(tempoRestante/2)
    },
    {
        tipo: 'tempo',
        valor: 0,
        desc: 'Tempo Pausado!',
        chance: 0.1,
        aplicar: () => clearInterval(timerInterval)
    },
    {
        tipo: 'vida',
        valor: 1,
        desc: 'Vida Extra!',
        chance: 0.1,
        aplicar: () => ganharVida()
    },
    {
        tipo: 'vida',
        valor: 1,
        desc: 'Vida Perdida!',
        chance: 0.1,
        aplicar: () => {
            if (vidaAtual >= 2) {
                perderVida();
            } else {
                const notificacao = document.querySelector('.evento-notificacao');
                escolherBonus();
            }
        }
    },
    {
         tipo: 'vida',
         valor: 6,
        desc: 'Vida Cheia!',
        chance: 0.1,
        aplicar: () => {
            vidaAtual = vidaMaxima;
            atualizarVidas();
        }
    },
    {
        tipo: 'tela',
        valor: 1,
        desc: 'Blackout! (60 segundos)',
        chance: 0.1,
        aplicar: () => {
            full.style.display = "block";
            full.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
            setTimeout(() => {
                full.style.display = "none";
            }, 60000);
        }
    },
    {
        tipo: 'tela',
        valor: 1,
        desc: 'Flashbang! (60 segundos)',
        chance: 0.1,
        aplicar: () => {
            full.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
            full.style.display = "block";
            setTimeout(() => {
                full.style.display = "none";
            }, 60000);
        }
    },
    {
        tipo: 'tempo',
        valor: 1,
        desc: 'Tempo ocultado! (5 perguntas)',
        chance: 0.1,
        aplicar: () => {
            const timerContainer = document.getElementById('timerContainer');
            timerContainer.style.filter = 'blur(50px)';
            setTimeout(() => {
                timerContainer.style.display = 'block';
            }, 50000);
        }
    }
    // Adicione outros efeitos aqui
];

function selecionarBonus() {
    const random = Math.random();
    let acumulado = 0;
    
    for(const efeito of efeitosBonus) {
        acumulado += efeito.chance;
        if(random <= acumulado) {
            return efeito;
        }
    }
    return efeitosBonus[0]; // Fallback
}

function normalizarChances() {
    const total = efeitosBonus.reduce((acc, cur) => acc + cur.chance, 0);
    efeitosBonus.forEach(efeito => {
        efeito.chance = efeito.chance / total;
    });
}

function escolherBonus(aceitou) {
    if (aceitou) {
        const efeito = selecionarBonus(); //efeitosBonus[Math.floor(Math.random() * efeitosBonus.length)];
        efeito.aplicar();
        mostrarEfeitoAtivo(efeito);
        clearTimeout(bonusTimeout);
    } else {
        bonusEl.remove()
    }
    bonusAtivo = false;
}

// Eventos obrigatórios
const eventos = [
    {
        desc: 'Velocidade 2x!',
        aplicar: () => {
            clearInterval(timerInterval);
            timerInterval = setInterval(updateTimer, 500);
            console.log ('Velocidade 2x')
            setTimeout(() => {
                clearInterval(timerInterval);
                console.log('voltando ao tempo normal')
                timerInterval = setInterval(updateTimer, 1000);
            }, 60000);
        }
    },
    {
        desc: 'Velocidade 0.5x! (60 segundos)',
        aplicar: () => {
            clearInterval(timerInterval);
            timerInterval = setInterval(updateTimer, 2000);
            setTimeout(() => {
                clearInterval(timerInterval);
                timerInterval = setInterval(updateTimer, 1000);
            }, 60000);
        }
    },
    {
        desc: 'Miopia! (60 segundos)',
        chance: 0.1,
        aplicar: () => {
            full.style.display = "block";
            full.style.backgroundColor = "transparent";
            full.style.backdropFilter = "blur(3px)";
            setTimeout(() => {
                full.style.display = "none";
                full.style.filter = "none";
            }, 60000);
        }
    },
    {
        desc: 'Foco! (60 segundos)',
        chance: 0.1,
        aplicar: () => {
            const vida = document.getElementById('vidas');
            const timer = document.getElementById('timerContainer');
            vida.style.filter = "blur(20px)";
            timer.style.filter = "blur(20px)";
            blurr = true;    
            setTimeout(() => {
                vida.style.filter = "none";
                timer.style.filter = "none";
                blurr = false;
            }, 60000);      
        }
    }
];

function triggerEvento() {
    const evento = eventos[Math.floor(Math.random() * eventos.length)];
    const notificacao = document.createElement('div');
    notificacao.className = 'evento-notificacao';
    notificacao.textContent = evento.desc;
    document.body.appendChild(notificacao);
    evento.aplicar();
    setTimeout(() => notificacao.remove(), 3000);
}

function mostrarEfeitoAtivo(efeito) {
    const indicador = document.createElement('div');
    indicador.className = 'efeito-ativo';
    indicador.textContent = efeito.desc;
    
    // Círculo de progresso
    const progresso = document.createElement('div');
    progresso.className = 'progresso';
    indicador.appendChild(progresso);
    
    document.getElementById('efeitos-ativos').appendChild(indicador);
    
    // Animação de 2s
    let tempo = 2;
    const animacao = setInterval(() => {
        tempo--;
        progresso.style.width = `${(tempo/60)*100}%`;
        if (tempo <= 0) {
            clearInterval(animacao);
            indicador.remove();
        }
    }, 1000);
}

// Adicionar nova categoria no JSON
async function carregarPerguntaEspecial() {
    const response = await fetch("perguntas-matematica.json");
    const perguntasMat = await response.json();
    const pergunta = perguntasMat[Math.floor(Math.random() * perguntasMat.length)];
    
    // Mostrar tela especial
    document.getElementById('pergunta').innerText = pergunta.pergunta;
    // ... resto da lógica de exibição ...
    
    // Configurar timer especial
    let tempoEspecial = 30;
    const timerEspecial = setInterval(() => {
        tempoEspecial--;
        if (tempoEspecial <= 0) {
            clearInterval(timerEspecial);
            perderVida();
            carregarPergunta();
        }
    }, 1000);
}