document.getElementById('telaInicial').style.display = "flex"

let intervall

let perguntas = {};
let vel = 1000; // 1 segundo do timer padrão, so pra poder mudar com mais facilidade essa desgraça
let perguntasD = {};
let perguntasM = {};
let perguntasDisponiveis = [];
let perguntaAtual = null;
let categoriaAtual = null;
let respostasCorretas = 0;
let respostasRaulSeixas = 0;
let tempoRestante = 60; // 1:30
let contadorPerguntas = 0;
let count = 3;
let timerInterval;

let RetoCoins = localStorage.getItem("RetoCoins") || 0;

let recorde = localStorage.getItem("recordeQuiz") || 0;
let respostas = localStorage.getItem("Respostas") || 0;
let respostasW = localStorage.getItem("respostasW") || 0; // Corrigido
let respostasR = localStorage.getItem("respostasR") || 0; // Corrigido
let timee = localStorage.getItem("timee") || 0;
let esgotado = localStorage.getItem("esgotado") || 0;

let errosCometidos = [];
let slideAtual = 0;
let slideIntervalErros;

let bonusAtivo = false;
let efeitosAtivos = [];
let blurr = false;

recorde = parseInt(recorde);
respostas = parseInt(respostas);
respostasW = parseInt(respostasW);
respostasR = parseInt(respostasR);
timee = parseInt(timee);
esgotado = parseInt(esgotado);

document.getElementById("retoCoins").innerText = RetoCoins;
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
    console.table(perguntas);
}

async function json2() {
    const response = await fetch("perguntasM.json");
    perguntas = await response.json();
    console.table(perguntas);
}

async function json3() {
    const response = await fetch("perguntasD.json");
    perguntas = await response.json();
    console.table(perguntas);
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

    console.table(perguntas);

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
        console.log('respostasR <= 50')
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
    const questions = document.getElementById('questions');
    const optiones = document.getElementById('optiones');

    questions.style.order = "1"
    optiones.style.order = "2"
    setTimeout(() => {
        limparErros();
    }, 1000)
    
    const vida = document.getElementById('vidas');
    const timer = document.getElementById('timerContainer');
    const rp = document.getElementById('rp');
    vida.style.filter = "none";
    timer.style.filter = "none";   
    rp.style.filter = "none";
                
    blurr = false;
    Invencibilidade = false;
    vidaAtual = 3;
    respostasRaulSeixas = 0;
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

}

function startTimer() {  

    console.log('start Timer real function')

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
            timerInterval = setInterval(updateTimer, 1000); // Começa o intervalo do timer após 1 segundo
        }, 1000);
    } else {
        // Caso contrário, começa o timer normalmente na primeira pergunta
        timerInterval = setInterval(updateTimer, 1000);
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
            console.log("respotas corretas", respostasCorretas)
            if (respostasRaulSeixas <= 0) {
                esgotado++;
                localStorage.setItem("esgotado", esgotado);
                clearInterval(timerInterval);
                mostrarTempoEsgotado(); 
            } else {
                vinheta4()
                mostrarExplicacao()
            }
            
        }
    }
    console.log(tempoRestante)
    
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

const vinheta5 = document.querySelector(".vinheta3");
function vinheta6() {
    vinheta5.classList.add("ativa3");
    // Remove a vinheta1 após a animação pra não ficar ocupando espaço na DOM
    setTimeout(() => {
        vinheta5.classList.remove("ativa3")
    }, 500)
}

function formatTime(seconds) {
    let minutos = Math.floor(seconds / 60);
    let segundos = seconds % 60;
    return `${minutos}:${segundos < 10 ? "0" + segundos : segundos}`;
}

function mostrarTempoEsgotado() {
    document.getElementById('menuBack').style.display = "none";
    isCarregandoPergunta = false;
    clearInterval(timerInterval);
    vinheta4()
    setTimeout(() => {
        full.style.display = "none";
        document.getElementById('overlay').style.display = "none";
        document.getElementById("telaInicial").style.display = "none";
        document.getElementById("telaQuiz").style.display = "none";
        document.getElementById("telaTempoEsgotado").style.display = "flex";
        document.getElementById("bonus-window").style.display = "none";
        bonusApply = false;
    }, 800);
}

let timeoutmb;
let timeouttg;
let eventTrigue = false;
let bonuscearaestadobrasileiro = false;
let isCarregandoPergunta = false;

function carregarPergunta() {
    
    console.log(isCarregandoPergunta)

    isCarregandoPergunta = true;

    document.getElementById("bonus-window").style.display = "none";
    console.log ('remove carregarpergunta')

    document.getElementById("telaQuiz").style.display = "flex";
    document.getElementById("telaExplicacao").style.display = "none";
    document.getElementById("telaTempoEsgotado").style.display = "none";

    if (perguntasDisponiveis.length === 0) {
        alert("Error: All questions have been answered.");
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
    console.log('start Timer do carregar Pergunta')
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
    
    if (Math.random() < 0.5 && !bonuscearaestadobrasileiro && !eventTrigue) {
        console.log('foi bonus')
        bonuscearaestadobrasileiro = true
        timeoutmb = setTimeout(() => {
            if (telaQuiz.style.display !== "none") {
                mostrarBonus();
            console.log('mostrarbonus carregarpergunta')
            }
            
        }, 10000);
    } else {console.log('num foi bonus')}

    if (Math.random() < 0.2 && !bonuscearaestadobrasileiro && !eventTrigue) {
        console.log('foi trigue')
        timeouttg = setTimeout(() => {
            if (telaQuiz.style.display !== "none") {
               eventTrigue = true
                triggerEvento();
                console.log('triggerEvento carregarpergunta') 
            }
            
        }, 6000);
    } else {console.log('num foi trige')}
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
    respostasRaulSeixas++;
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

        if (respostasCorretas % 2 === 0) {
            RetoCoins += 100;
            RetoCoins = parseInt(RetoCoins)
            console.log(RetoCoins)
            localStorage.setItem("RetoCoins", RetoCoins);
            document.getElementById("retoCoins").innerText = RetoCoins;
        }
    } else {

        respostasW++;
        localStorage.setItem("respostasW", respostasW);
        // Se a resposta for errada, adiciona a classe 'errada' à opção clicada
        if (!blurr) {
            elemento.classList.add("errada");
        }
        
        // Armazenar detalhes do erro
        errosCometidos.push({
            categoria: categoriaAtual,
            descricao: perguntas[categoriaAtual].descricao,
            explicacao: perguntaAtual.explicacao,
            pergunta: perguntaAtual.pergunta
        });
        
        if (!Invencibilidade) {
            perderVida();
        }
        atualizarRecordeAtual();
        atualizarRecorde();
        
    }

    if (!blurr) {
        const opcoesEl = document.querySelectorAll("#opcoes li");
        const indiceCorreto = opcoes.findIndex(opcao => opcao.index === correta);

        opcoesEl[indiceCorreto].classList.add("correta");
    }

    clearTimeout('timeoutmb');
    clearTimeout('timeouttg')
        
    

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

    document.getElementById("bonus-window").style.animation = "slideUp 0.5s forwards";
    document.getElementById("bonus-window").style.pointerEvents = "none";
    setTimeout(() => {
        document.getElementById("bonus-window").style.display = "none";
    }, 600);
}


function mostrarExplicacao() {
    document.getElementById('menuBack').style.display = "none";
    isCarregandoPergunta = false;
    vinheta2() 
    setTimeout(() => {
        full.style.display = "none";
        document.getElementById('overlay').style.display = "none";
        document.getElementById("telaQuiz").style.display = "none";
        document.getElementById("telaExplicacao").style.display = "flex";
        document.getElementById("bonus-window").style.display = "none";
        bonusApply = false;
    }, 500);
}

function backBtnMarcelo() {
    if (tempoRestante > 5) {
        clearInterval(timerInterval);
        setTimeout(() => {
            voltarParaTelaInicial()
        }, 100);
}  
    }
    

function voltarParaTelaInicial() {
    vinheta6()
    setTimeout(() => {
        document.getElementById('menuBack').style.display = "none";
        isCarregandoPergunta = false;
        atualizarBarraProgresso();
        full.style.display = "none";
        document.getElementById('overlay').style.display = "none";
        document.getElementById("telaExplicacao").style.display = "none";
        document.getElementById("telaTempoEsgotado").style.display = "none";
        document.getElementById("telaInicial").style.display = "flex";
        document.getElementById("bonus-window").style.display = "none";
        document.getElementById("telaQuiz").style.display = "none";
        bonusApply = false;
    }, 200)
}

function mostrarLojaMenu() {
    vinheta6()
    setTimeout(() => {
        document.getElementById('menuBack').style.display = "none";
        isCarregandoPergunta = false;
        atualizarBarraProgresso();
        full.style.display = "none";
        document.getElementById('overlay').style.display = "none";
        document.getElementById("telaExplicacao").style.display = "none";
        document.getElementById("telaTempoEsgotado").style.display = "none";
        document.getElementById("telaInicial").style.display = "none";
        document.getElementById("bonus-window").style.display = "none";
        document.getElementById("telaQuiz").style.display = "none";
        document.getElementById("telaLoja").style.display = "flex";
        bonusApply = false;
    }, 200)
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

function atualizarStats() {
    const rotate = document.getElementById('rotate');
    setTimeout(() => {
        rotate.style.animation = "rotate-an 1s forwards infinite"
    }, 100);
    
    setTimeout (() => {
        rotate.style.animation = ""
        document.getElementById("recordee").innerText = recorde;
            document.getElementById("recorde").innerText = recorde;
            atualizarRecorde()
            document.getElementById("respostas").innerText = respostas;
            document.getElementById("respostasW").innerText = respostasW;
            document.getElementById("respostasR").innerText = respostasR;
            document.getElementById("esgotado").innerText = esgotado;
            console.log('estatisticas atualizada')
    }, 3000);
    
}

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
        timerElement.innerHTML = '<p class="rmais">R+</p>';
        const checkIcon = document.querySelector('.rmais');
        
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
            mostrarErrosSlide();
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
    vinheta.style.background = "#6e8f7c";
    json1().then(() => {
        iniciarQuiz();
    });

    const originalVerificarResposta = verificarResposta;
    verificarResposta = function(...args) {
        originalVerificarResposta.apply(this, args);

        setTimeout(() => {
            if (respostasCorretas === 30) {
                console.log("Mudando para perguntas MÉDIAS");
                json2().then(() => reiniciarPerguntasDisponiveis());
            } else if (respostasCorretas === 60) {
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
    vinheta.style.background = "#ffc671";
    json2().then(() => {
        iniciarQuiz(); // Inicia o quiz após carregar o JSON
    });
}

function hardPlay() {
    const vinheta = document.getElementById('vinheta');
    vinheta.style.background = "#e96767";
    json3().then(() => {
        iniciarQuiz(); // Inicia o quiz após carregar o JSON
    });
}

function randomPlay() {
    vinheta.style.background = "#6e8f7c";
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
const full = document.getElementById('full');
// Efeitos dos bônus
const efeitosBonus = [
    {
        tipo: 'tempo',
        valor: 2,
        desc: 'Tempo Dobrado',
        chance: 0.1,
        aplicar: () => { 
            tempoRestante *= 2
            console.log('tempo dobrado')
        } 
    },
    {
        tipo: 'tempo',
        valor: 1,
        desc: 'Tempo congelado',
        chance: 0.1,
        aplicar: () => {
            clearInterval(timerInterval);
            setTimeout(() => {
                timerInterval = setInterval(updateTimer, 1000);
            }, 30000);
            console.log('tempo congelado')
        }
    },
    {
        tipo: 'tempo',
        valor: 0.5,
        desc: 'Tempo Reduzido',
        chance: 0.1,
        aplicar: () =>  { 
            bonusHeader.style.border = "0.7vmin solid #e96767";
            tempoRestante = Math.floor(tempoRestante/2)
            console.log('tempo reduzido')
        }
    },
    {
        tipo: 'vida',
        valor: 1,
        desc: 'Vida Extra',
        chance: 0.1,
        aplicar: () => {
            ganharVida()
            console.log('vida extra')
        }
    },
    {
        tipo: 'vida',
        valor: 1,
        desc: 'Vida Perdida',
        chance: 0.1,
        aplicar: () => {
            if (vidaAtual >= 2) {
                bonusHeader.style.border = "0.7vmin solid #e96767";
                perderVida();
            } else {
                escolherBonus();
            }
            console.log('vida perdida')
        }
    },
    {
        tipo: 'tela',
        valor: 1,
        desc: 'Blackout',
        chance: 0.1,
        aplicar: () => {
            bonusHeader.style.border = "0.7vmin solid #e96767";
            document.getElementById('overlay').style.display = "block";
            setTimeout(() => {
                document.getElementById('overlay').style.display = "none";
            }, 60000);
            console.log('blackout')
        }
    },
    {
        tipo: 'tela',
        valor: 1,
        desc: 'Flashbang',
        chance: 0.1,
        aplicar: () => {
            bonusHeader.style.border = "0.7vmin solid #e96767";
            full.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
            full.style.display = "block";
            setTimeout(() => {
                full.style.display = "none";
            }, 60000);
            console.log('flashbang')
        }
    },
    {
        tipo: 'tempo',
        valor: 1,
        desc: 'Tempo ocultado',
        chance: 0.1,
        aplicar: () => {
            bonusHeader.style.border = "0.7vmin solid #e96767";
            const timerContainer = document.getElementById('timerContainer');
            timerContainer.style.filter = 'blur(25px)';
            setTimeout(() => {
                timerContainer.style.filter = 'none';
            }, 50000);
            console.log('tempo ocultado')
        }
    },
    {
        tipo: 'pergunta',
        valor: 1,
        desc: 'Nova pergunta',
        chance: 0.1,
        aplicar: () => {
            setTimeout(() => {
                changeUruguai();
            }, 1000)
            
            console.log('nova pergunta')
        }
    }
    // Adicione outros efeitos aqui
];

function normalizarChances() {
    const total = efeitosBonus.reduce((acc, cur) => acc + cur.chance, 0);
    efeitosBonus.forEach(efeito => {
        efeito.chance = efeito.chance / total;
    });
}

let Invencibilidade = false

// Eventos obrigatórios
const eventos = [
    {
        desc: '2x Velocidade',
        chance: 0.1,
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
        desc: '0.5x Velocidade',
        chance: 0.1,
        aplicar: () => {
            timer05x();
            console.log ('Velocidade 0.5x');
        }
    },
    {
        desc: 'Miopia',     
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
        desc: 'Foco!',
        chance: 0.1,
        aplicar: () => {
            const vida = document.getElementById('vidas');
            const timer = document.getElementById('timerContainer');
            const rp = document.getElementById('rp');
            vida.style.filter = "blur(20px)";
            timer.style.filter = "blur(20px)";
            rp.style.filter = "blur(20px)";
            blurr = true;    
            setTimeout(() => {
                vida.style.filter = "none";
                timer.style.filter = "none";
                rp.style.filter = "none";
                blurr = false;
            }, 60000);      
        }
    },
    {
        desc: 'Invencibilidade',
        chance: 0.1,
        aplicar: () => {
            Invencibilidade = true;
        }
    },
    {
        desc: 'HUD Invertido',
        chance: 0.1,
        aplicar: () => {
            inverterLayout();
        }
    }
];

function triggerEvento() {
    const evento = eventos[Math.floor(Math.random() * eventos.length)];
    const notificacao = document.createElement('div');
    notificacao.className = 'evento-notificacao';
    notificacao.style.animation = "slideDownn 1s forwards";
    
    // Definir o conteúdo como HTML
    notificacao.innerHTML = 
    `
    <div id="event-ntnt">
        <h3>EVENTO <br> ALEATÓRIO</h3>
        <div class="line">        
            <div><hr></div><div><p>${evento.desc}</p></div><div><hr></div>
        </div>
            
    </div>
    `;

    document.body.appendChild(notificacao);
    evento.aplicar();
    setTimeout(() => {
        notificacao.style.animation = "slideUp 1s forwards";
        eventTrigue = false;
        setTimeout(() => {
            notificacao.remove();
        }, 1000)
        
    }, 2000);
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

// Variável global para controle do nível
let currentLevel = 1;

function calcularNivel(respostasR) {
    return Math.min(Math.floor(respostasR / 10)); // Alterado para começar do 0
}

function atualizarBarraProgresso() {
    const respostasR = parseInt(localStorage.getItem("respostasR")) || 0;
    currentLevel = calcularNivel(respostasR);
    
    // Ajuste nos limites do nível
    const start = currentLevel * 10;
    const end = (currentLevel + 1) * 10;
    
    const progresso = respostasR - start;
    const porcentagem = (progresso / (end - start)) * 100;
  
    const progressElement = document.querySelector('.progress');
    progressElement.style.width = `${Math.min(porcentagem, 100)}%`;
  
    document.getElementById('currentLevel').textContent = currentLevel;
}

// Chamar a função ao carregar a página
atualizarBarraProgresso();

const bonusValuesDiv = document.getElementById("bonus-values");
const bonusWindow = document.getElementById("bonus-window");
const bonusContent = document.getElementById("bonus-content");
const bonusHeader = document.getElementById("bonus-header");
let bonusTimeoutTime = 200;

function choseBonus() { //pra quando aceitar o bonus   
    displayBonus();
    clearInterval(intervall);
    bonusContent.style.display = "block";
    bonusHeader.style.pointerEvents = "none";
    setTimeout(() => {
        document.getElementById("bonus-text").style.display = "block"
    }, 200);   
}

function mostrarBonus() { //pra chamar a função de mostrar o bonus
    if (document.getElementById('telaQuiz').style.display !== "none") {
        bonusHeader.style.border = "0.7vmin solid #6e8f78";
        bonusWindow.style.opacity = "1"
        bonusApply = true;
        clearInterval(intervall);
        mostrarBonuss();
    } else {
        console.log('telaQuiz = none')
    }
}

function mostrarBonuss() { // a função de chamar o bonus
    setTimeout(() => {
        console.log('mostrarbonus')
    }, 1000);
    bonusHeader.style.pointerEvents = "auto";
    bonusWindow.style.display = "flex";
    bonusWindow.style.animation = "slideDownn 1s forwards";

    intervall = setTimeout(() => {
        bonusWindow.style.animation = "slideUp 1s forwards";
        setTimeout(() => {
            bonusWindow.style.display = "none";
            bonusHeader.style.pointerEvents = "none";
            bonuscearaestadobrasileiro = false
        }, 1100);
        
    }, 8000);

    console.log(tempoRestante)
}

function displayBonus() { // o randomizador de bonus
    let bonusIterationCount = 0;
    const interval = setInterval(() => {
        const randomValues = [];
        const selectedBonuses = []; // Array para armazenar os bônus selecionados

        // Calcula a soma total das chances
        const totalChance = efeitosBonus.reduce((sum, bonus) => sum + bonus.chance, 0);

        while (selectedBonuses.length < 3) {
            let random = Math.random() * totalChance;
            let chosenBonus = null;

            // Determina qual bônus foi escolhido com base no valor aleatório
            for (const bonus of efeitosBonus) {
                if (random <= bonus.chance) {
                    chosenBonus = bonus;
                    break;
                }
                random -= bonus.chance;
            }

            // Verifica se o bônus já foi selecionado
            if (chosenBonus && !selectedBonuses.includes(chosenBonus)) {
                selectedBonuses.push(chosenBonus);
                randomValues.push(chosenBonus.desc); // Armazena a descrição para exibição
            }
        }

        bonusValuesDiv.innerHTML = '';
        randomValues.forEach(descricao => { // Usa 'descricao' aqui
            const p = document.createElement("p");
            p.textContent = descricao;
            bonusValuesDiv.appendChild(p);
        });

        bonusIterationCount++;
        if (bonusIterationCount >= 25) {
            clearInterval(interval);
            if (bonusApply) {
                displayBonus(selectedBonuses[1]);
            }
             // Passa o objeto bônus selecionado
            const bonusMeio = selectedBonuses[1];
            selectedBonusObj = bonusMeio; // Armazena o objeto do bônus do meio
            // Adiciona a classe 'destacado' ao elemento do meio APÓS a escolha
            const elementosP = bonusValuesDiv.querySelectorAll('p');
            setTimeout(() => {
                elementosP[1].classList.add('destacado');  
            }, 100); 
        }
    }, bonusTimeoutTime);
    

    function displayBonus(bonus) {
        console.log(`O bônus escolhido foi: ${bonus.desc}`);
        bonus.aplicar();
    }

    setTimeout(() => {
        
        bonusWindow.style.animation = "slideUp 1s forwards";
        setTimeout(() => {
            bonusWindow.style.display = "none";
            bonusContent.style.display = "none";
            document.getElementById("bonus-text").style.display = "none"
            bonuscearaestadobrasileiro = false
        }, 1100);
        

    }, 8000);
}

let bonusApply = true;

function updateMask(x, y) {
    const overlay = document.getElementById("overlay");
    overlay.style.maskImage = `radial-gradient(circle 120px at ${x}px ${y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)`;
    overlay.style.webkitMaskImage = overlay.style.maskImage;
}

function showOverlay() {
    const overlay = document.getElementById("overlay");
    if (!overlay.style.maskImage || overlay.style.maskImage === "none") {
        updateMask(window.innerWidth / 2, window.innerHeight / 2);
    }
}

document.addEventListener("mousemove", (e) => {
    showOverlay();
    updateMask(e.clientX, e.clientY);
});

document.addEventListener("touchmove", (e) => {
    showOverlay();
    const touch = e.touches[0];
    updateMask(touch.clientX, touch.clientY);
}, { passive: true });

function mostrarErrosSlide() {
    const container = document.getElementById('slideErrosContainer');
    const contador = document.getElementById('contadorErros');
    
    document.getElementById('telaErros').style.display = 'grid';
    contador.textContent = `${slideAtual + 1}/${errosCometidos.length}`;
    
    // Criar slides
    container.innerHTML = errosCometidos.map((erro, index) => `
        <div class="slide-erro ${index === 0 ? 'ativo' : ''}" data-index="${index}">
            <div class="erro-card">
                <div class="depressao-pos-parto">
                    <h3>${erro.categoria}</h3>
                    <p style="color: #f4bb8c; margin: 0;">Era a resposta Correta</p>
                    <p class="descricao-curta">${erro.descricao}</p>
                </div>
                <button onclick="mostrarExplicacaoCompleta(${index})">Ver detalhes</button>
            </div>
        </div>
    `).join('');
}


function proximoSlide() {
    const slides = document.querySelectorAll('.slide-erro');
    slideAtual = (slideAtual + 1) % slides.length;
    
    slides.forEach((slide, index) => {
        slide.classList.remove('ativo', 'anterior');
        if (index === slideAtual) slide.classList.add('ativo');
        if (index === (slideAtual - 1 + slides.length) % slides.length) slide.classList.add('anterior');
    });
    
    document.getElementById('contadorErros').textContent = `${slideAtual + 1}/${errosCometidos.length}`;

    console.log(slideAtual);
}

function slideAnterior() {
    const slides = document.querySelectorAll('.slide-erro');
    slideAtual = (slideAtual - 1 + slides.length) % slides.length;
    
    slides.forEach((slide, index) => {
        slide.classList.remove('ativo', 'anterior');
        if (index === slideAtual) slide.classList.add('ativo');
        if (index === (slideAtual + 1) % slides.length) slide.classList.add('anterior');
    });
    
    document.getElementById('contadorErros').textContent = `${slideAtual + 1}/${errosCometidos.length}`;
    console.log(slideAtual);
}

function mostrarExplicacaoCompleta(index) {
    clearInterval(slideIntervalErros);
    const erro = errosCometidos[index];
    
    document.getElementById('telaErrosCompleto').style.display = 'flex';
    document.getElementById('erroCompletoCategoria').textContent = erro.categoria;
    document.getElementById('erroCompletoPergunta').textContent = erro.pergunta;
    document.getElementById('erroCompletoExplicacao').textContent = erro.explicacao;
    document.getElementById('erroCompletoContador').textContent = `${index + 1}/${errosCometidos.length}`;
    
    // Atualizar navegação
    document.querySelectorAll('.nav-erro-completo').forEach(btn => {
        btn.onclick = function() {
            let newIndex = index;
            if (this.classList.contains('proximo')) {
                newIndex = (index + 1) % errosCometidos.length; // Correção cíclica
            } else {
                newIndex = (index - 1 + errosCometidos.length) % errosCometidos.length; // Correção cíclica
            }
            mostrarExplicacaoCompleta(newIndex);
        };
    });
}

function limparErros() { 
    // Resetar todos os erros
    errosCometidos = [];
    slideAtual = 0;

    // Atualizar UI
    document.getElementById('contadorErros').textContent = '0/0';
    document.getElementById('slideErrosContainer').innerHTML = '';
}

function showBtnBackMenu() {
    const menuBack = document.getElementById('menuBack');
    if (menuBack.style.display !== "flex") {
        menuBack.style.display = "flex";        
    } else {
        menuBack.style.display = "none";  
    }    
}

function ocultBtnBackMenu() {
    const menuBack = document.getElementById('menuBack');
    menuBack.style.display = "none";
}


window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "Tem certeza que deseja sair? Seu progresso pode ser perdido.";
});

function inverterLayout() {
    const questions = document.getElementById('questions');
    const optiones = document.getElementById('optiones');

    questions.style.order = "2"
    optiones.style.order = "1"
    setTimeout(() => {
        if (telaQuiz.style.display !== "none") {
            questions.style.order = "1"
            optiones.style.order = "2"
        }
    }, 60000)
}


//parte miserave da loja, eu odeio minha vida e to recebendo muito pouco por isso

const todosItens = [
    { id: 1, nome: 'Remover Tempo', efeito: 'para o tempo', preco: 5000, icon: 'fa-star'},
    { id: 2, nome: '0.5x Velocidade', efeito: 'desacelera o tempo', preco: 3000, icon: 'fa-star'},
    { id: 3, nome: 'Aumentar Tempo', efeito: 'Adiciona 60 segundos ao tempo', preco: 2000, icon: 'fa-star'},
    { id: 4, nome: 'Pular Pergunta', efeito: 'Muda a Pergunta', preco: 6000, icon: 'fa-star' },
    // { id: 5, nome: 'Dobro de Pontos', efeito: 'Dobro de pontos', preco: 2500, icon: 'fa-star' },
    // { id: 6, nome: 'remover Evento', efeito: 'Remove o evento', preco: 3000, icon: 'fa-star' },
    { id: 7, nome: 'Vida Cheia', efeito: 'Deixa a Vida cheia', preco: 10000, icon: 'fa-star' },
    { id: 8, nome: '1+ vida', efeito: 'Adiciona uma vida a mais', preco: 2000, icon: 'fa-star' },
    { id: 9, nome: '2+ vida', efeito: 'Adiciona duas vidas a mais', preco: 4100, icon: 'fa-star' },
    // { id: 10, nome: 'Cura', efeito: 'Recupera a vida gradualmente durante toda a partida', preco: 15000, icon: 'fa-star' },
    // { id: 11, nome: 'Escudo', efeito: 'Não leva dano por 3 perguntas erradas', preco: 8000, icon: 'fa-star'},
    // { id: 12, nome: 'Reencarnação', efeito: 'ao morrer, ganha uma segunda chance, com a vida cheia, mas com metade da pontuação', preco: 15000, icon: 'fa-star'},
    // { id: 13, nome: 'Ressureição', efeito: 'Ao morrer, ganha uma chance de voltar a vida com 1 coração e todos seus itens', preco: 8000, icon: 'fa-star'}
];

const acoesItens = {
    1: () => stopTimer(),
    2: () => timer05x(),
    3: () => addTime(60),
    4: () => changeUruguai(),
    // 5: () => console.log('id 5'),
    // 6: () => console.log('id 6'),
    7: () => MaxLife(),
    8: () => ganharVida(),
    9: () => gainLife(),
    // 10: () => console.log('id 10'),
    // 11: () => console.log('id 6'),
    // 12: () => console.log('id 7'),
    // 13: () => console.log('id 8'),
};

let inventario = [];

let lojaAtual = [];  // Armazena os itens e limites atuais da loja
let comprados = {};


// Carregar dados salvos
function carregarProgresso() {
    const salvosInventario = localStorage.getItem('inventario');
    const salvosMoeda = localStorage.getItem('RetoCoins');
    
    
    if (salvosMoeda) RetoCoins = parseInt(salvosMoeda);
    
    atualizarInventario();
    atualizarDinheiroDisplay();
}

// Salvar progresso
function salvarProgresso() {
    localStorage.setItem('inventario', JSON.stringify(inventario));
    localStorage.setItem('RetoCoins', RetoCoins.toString());
}

// Atualizar display do dinheiro
function atualizarDinheiroDisplay() {
    document.getElementById('dinheiro').textContent = RetoCoins;
}

// Sortear itens para a loja
function sortearItensLoja() {
    return [...todosItens]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
}

// Mostrar loja
function mostrarLoja() {
    const lojaDiv = document.getElementById('loja');
    const itensLoja = lojaAtual; // Usa os itens já gerados com limites

    lojaDiv.innerHTML = '<h3></h3>';

    lojaAtual.forEach(item => {
        const compradoCount = comprados[item.id] || 0;
        const disponivel = item.limite - compradoCount;
        const esgotado = disponivel <= 0;
        const limiteInventario = inventario.length >= 5 && !inventario.some(i => i.id === item.id);


        const itemDiv = document.createElement('div');
        itemDiv.className = `item${esgotado ? ' esgotado' : ''}`; // Adiciona classe se esgotado
        
        itemDiv.innerHTML = `
            
            <div class="priceStore"> 
                <p class="priceStore"> ${item.preco}  </p>
                <div class="macaco">  
                    <p>R+</p>
                </div>
            </div>

            <h4 class="linguado"><i class="fa-solid ${item.icon}"></i></h4>
            <h4 class="abapuru">${item.nome}</h4>
            
            <div class=estroque>
                <div class="estoque">${esgotado ? '0' : `${disponivel}`}</div>
            </div>
            
            <button class="botonePatone"
                onclick="comprarItem(${item.id})" 
                ${RetoCoins < item.preco || esgotado ? 'disabled' : ''}
            >
                ${esgotado ? 'Esgotado' : 'Comprar'}
            </button>
        `;
        lojaDiv.appendChild(itemDiv);
    }); 
}

function mostrarNotificacao(mensagem) {
    const notificacoesDiv = document.getElementById('notificacoes');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensagem;
    
    notificacoesDiv.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function comprarItem(itemId) {
    const item = lojaAtual.find(i => i.id === itemId);
    
    if (inventario.length >= 5 && !inventario.some(i => i.id === itemId)) {
        mostrarNotificacao('Inventário cheio. Não é possível comprar mais itens.');
        return;
    }

    // Verifica quantos já foram comprados
    const compradosAtual = comprados[itemId] || 0;
    const disponivel = item.limite - compradosAtual;

    if (disponivel <= 0) {
        console.log("Limite de compras atingido para este item!");
        return;
    }

    if (RetoCoins >= item.preco) {
        RetoCoins -= item.preco;
        
        // ⭐⭐ AQUI É ONDE VOCÊ DEVE COLOCAR ⭐⭐
        comprados[itemId] = compradosAtual + 1; // Atualiza o contador
        
        // Resto da lógica de adicionar ao inventário
        const itemExistente = inventario.find(i => i.id === itemId);
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            inventario.push({
                id: itemId,
                quantidade: 1
            });
        }
        
        // Atualizações finais
        salvarProgresso();
        atualizarDinheiroDisplay();
        atualizarInventario();
        mostrarLoja();
    }
}

// Atualizar inventário
function atualizarInventario() {
    const inventarioDiv = document.getElementById('inventario');
    inventarioDiv.innerHTML = '<h3>Inventário</h3>';
    
    inventario.forEach((item, index) => {
        const itemOriginal = todosItens.find(i => i.id === item.id);
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <h4><i class="fa-solid ${itemOriginal.icon}"></i></h4>
            <h4>${itemOriginal.nome} (${item.quantidade}x)</h4>
            <p>${itemOriginal.efeito}</p>
            <button onclick="removerItem(${index})">Remover</button>
        `;
        inventarioDiv.appendChild(itemDiv);
    });
}

function removerItem(index) {
    const item = inventario[index];
    
    if(item.quantidade > 1) {
        item.quantidade--;
    } else {
        inventario.splice(index, 1);
    }
    
    salvarProgresso();
    atualizarInventario();
    console.log('Item removido do inventário');
}

// Usar item
function usarItem(index) {
    const itemUsado = inventario[index];
    const itemOriginal = todosItens.find(i => i.id === itemUsado.id);

    // Executa o console.log específico
    if (acoesItens[itemUsado.id]) {
        acoesItens[itemUsado.id]();
    } else {
        console.log(`Usou: ${itemOriginal.nome} - ${itemOriginal.efeito}`);
    }

    itemUsado.quantidade--;
    
    if (itemUsado.quantidade <= 0) {
        inventario.splice(index, 1);
    }
    
    salvarProgresso();
    atualizarInventario();
}

// Inicialização
window.onload = () => {
    carregarProgresso();
    gerarLoja();
    mostrarLoja();
    atualizarDinheiroDisplay();
};

// Adicione esta nova função
function ganharDinheiro() {
    RetoCoins += 10000;
    salvarProgresso();
    atualizarDinheiroDisplay();
    console.log('+100 moedas ganhas!');
}

function gerarLoja() {
    lojaAtual = [];
    comprados = {};
    
    const itensDisponiveis = [...todosItens]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
        .map(item => ({
            ...item,
            limite: Math.floor(Math.random() * 5) + 1 // Limite aleatório 1-5
        }));
    
    lojaAtual.push(...itensDisponiveis);
}

function recarregarLoja() {
    if (RetoCoins >= 50) {
        RetoCoins -= 50;
        gerarLoja();
        mostrarLoja();
        salvarProgresso();
        atualizarDinheiroDisplay();
    }
}

function toggleStoreInv() {
    if (document.getElementById('loja').style.display !== "grid") {
        document.getElementById('loja').style.display = "grid";
        document.getElementById('inventarioLoja').style.display = "none";
    } else {
        document.getElementById('loja').style.display = "none";
        document.getElementById('inventarioLoja').style.display = "block";
    }
}

toggleStoreInv();


// bonus e itens da loja (functions separadas)

function changeUruguai() {
    const changeUruguai = document.getElementById('full-changeUruguai');
    ocultBtnBackMenu()
    changeUruguai.style.display = "block";
    changeUruguai.style.animation = "whiter 5.5s"
    clearInterval(timerInterval);
    console.log('a1')
    setTimeout(() => {
        for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    carregarPergunta(); // Chama a função 10 vezes
                }, i * 250)  
            }
    }, 500);
    setTimeout(() => {
        changeUruguai.style.display = "none";
        setInterval(timerInterval, 1000)
        changeUruguai.style.animation = ""
        carregarPergunta();
    }, 6000);
}

function MaxLife() { // Vida cheia
    vidaAtual = vidaMaxima;
    atualizarVidas();
    console.log('vida cheia')
}

function timer05x() { // 0.5x Velocidade
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 2000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function addTime(t) { // Aumentar tempo
    tempoRestante += t;
    console.log('tempo aumentado')
}

function gainLife() { // Ganha 2 vidas caso a vida maxima for 4, se for 5 ganha 1 vida, se for 6 ganha 0 vidas
    if (vidaAtual <= 4) {
        vidaAtual += 2;
    } else if (vidaAtual === 5) {
        vidaAtual += 1;
    } else if (vidaAtual = vidaMaxima) {
        console.log('vida maxima, usou atoa kkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
    }
    atualizarVidas();
}